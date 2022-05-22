import { Node, nodeInputRule, mergeAttributes } from "@tiptap/core";

const inputRegex = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

export type TipTapImageParams = {
    src: string;
    loading: string;
};

export default Node.create({
    name: "image",

    defaultOptions: {
        inline: false,
        HTMLAttributes: {},
    },

    inline() {
        return this.options.inline;
    },

    group() {
        return this.options.inline ? "inline" : "block";
    },

    draggable: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
            loading: {
                default: "lazy",
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: "img[src]",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "img",
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
        ];
    },

    // @ts-expect-error
    addCommands() {
        return {
            setImage:
                (options: TipTapImageParams) =>
                ({ commands }: { commands: any }) => {
                    return commands.insertContent({
                        type: this.name,
                        attrs: options,
                    });
                },
        };
    },

    addInputRules() {
        return [
            nodeInputRule(inputRegex, this.type, (match) => {
                const [, alt, src, title, loading] = match;

                return { src, alt, title, loading };
            }),
        ];
    },
});
