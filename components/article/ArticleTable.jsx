import React from "react";
import moment from "moment";
import "moment/locale/th";


const ArticleTable = (articles) => {

    return (
        <div className="flex flex-col w-full p-2">
            <table className="table-auto border-collapse border-2 border-gray-200">
                <thead className="bg-gray-200 text-sm">
                    <tr className="text-center">
                        <th>หัวเรื่อง</th>
                        <th>Author</th>
                        <th>published</th>
                        <th>วันที่</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {articles.length > 0 ? articles.map((article) => (
                        <tr key={article._id}>
                            <td>{article.title}</td>
                            <td>{article.userId}</td>
                            <td>{article.published === true ? "Yes" : "No"}</td>
                            <td>{moment(article.createdAt).fromNow()}</td>
                            <td>
                                <button>Edit</button>
                                <button>Delete</button>
                            </td>
                        </tr>
                    )): (
                        <div>
                            <span className="text-center text-sm">ไม่มีข้อมูล</span>
                        </div>
                    )}
                </tbody>
            </table>
        </div>
    );
};



export default ArticleTable;