import { Extension } from "@tiptap/core";

const FontSize = Extension.create({
  name: "fontSize",

  addOptions: {
    types: ["textStyle"],
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) => {
          return chain().setMark("textStyle", { fontSize: size }).run();
        },
    };
  },
});

export default FontSize;
