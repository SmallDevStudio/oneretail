import { useState, useEffect } from 'react';
import { Select, Button, Table } from 'antd'; // Use Ant Design components or similar
import axios from 'axios';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const { Option } = Select;

const ContentReport = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [dataSize, setDataSize] = useState(10);
  const [contentData, setContentData] = useState([]);

  console.log('contentData:', contentData);

  useEffect(() => {
    // Fetch categories
    axios.get('/api/dashboard/content/category').then(response => setCategories(response.data.categories));
    axios.get('/api/dashboard/content/group').then(response => setGroups(response.data.groups));
  }, []);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    // Fetch subcategories based on selected category
    axios.get(`/api/dashboard/content/subcategory?category=${categoryId}`).then(response => setSubcategories(response.data.subcategories));
  };

  const handleFetchData = () => {
    const query = {
      category: selectedCategory,
      subcategory: selectedSubcategory,
      group: selectedGroup,
      limit: dataSize
    };
    axios.get('/api/dashboard/contentreport', { params: query }).then(response => setContentData(response.data.data.contents));
  };

  

  const handleExport = () => {
    const contentViews = contentData.flatMap(content => content.contentViews);
    const comments = contentData.flatMap(content => content.comments);

    const likesSheet = XLSX.utils.json_to_sheet(contentViews.map(view => ({
      contentId: view.contentId,
      userId: view.user.userId,
      userName: view.user.fullname,
      userPicture: view.user.pictureUrl
    })));

    const commentsSheet = XLSX.utils.json_to_sheet(comments.map(comment => ({
      contentId: comment.contentId,
      commentId: comment._id,
      userId: comment.user.userId,
      userName: comment.user.fullname,
      commentText: comment.text
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, likesSheet, 'Likes');
    XLSX.utils.book_append_sheet(workbook, commentsSheet, 'Comments');

    const wbout = XLSX.write(workbook, { type: 'binary', bookType: 'xlsx' });
    const buffer = new ArrayBuffer(wbout.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < wbout.length; ++i) view[i] = wbout.charCodeAt(i) & 0xFF;

    saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'ContentReport.xlsx');
  };

  return (
    <div>
      <h2>Content Report</h2>
      <Select placeholder="Select Category" onChange={handleCategoryChange}>
        {categories.map(category => (
          <Option key={category._id} value={category._id}>{category.title}</Option>
        ))}
      </Select>
      <Select placeholder="Select Subcategory" onChange={value => setSelectedSubcategory(value)}>
        {subcategories.map(subcategory => (
          <Option key={subcategory._id} value={subcategory._id}>{subcategory.title}</Option>
        ))}
      </Select>
      <Select placeholder="Select Group" onChange={value => setSelectedGroup(value)}>
        {groups.map(group => (
          <Option key={group._id} value={group._id}>{group.name}</Option>
        ))}
      </Select>
      <Select defaultValue={10} onChange={value => setDataSize(value)}>
        <Option value={10}>Top 10</Option>
        <Option value={20}>Top 20</Option>
        <Option value={50}>Top 50</Option>
        <Option value={100}>Top 100</Option>
        <Option value={120}>Top 120</Option>
        <Option value={150}>Top 150</Option>
        <Option value={200}>Top 200</Option>
      </Select>
      <Button onClick={handleFetchData}>Fetch Data</Button>
      <Button onClick={handleExport}>Export to Excel</Button>
      <Table dataSource={contentData} rowKey="_id" columns={[
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Author', dataIndex: 'author.fullname', key: 'author' },
        { title: 'Views', dataIndex: 'views', key: 'views' },
        { title: 'Category', dataIndex: 'categories', key: 'categories' },
        { title: 'Subcategory', dataIndex: 'subcategories', key: 'subcategories' }
      ]} />
    </div>
  );
};

export default ContentReport;
