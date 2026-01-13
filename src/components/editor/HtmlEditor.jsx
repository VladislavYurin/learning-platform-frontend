import React, {useEffect, useState} from "react";
import {Box} from "@mui/material";
import {Editor} from "@tinymce/tinymce-react";

const HtmlEditor = ({value, onChange}) => {
    const [editorContent, setEditorContent] = useState(value || "");

    useEffect(() => {
        setEditorContent(value || "");
    }, [value]);

    const handleEditorChange = (content) => {
        setEditorContent(content);
        onChange?.(content);
    };

    return (
        <Box sx={{mt: 2}}>
            <Editor
                // apiKey можно убрать, TinyMCE будет работать в dev без ключа,
                // но лучше потом добавить реальный ключ
                // apiKey="your-api-key"
                value={editorContent}
                init={{
                    height: 560,
                    menubar: true,
                    plugins: [
                        "advlist autolink lists link image charmap preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount",
                    ],
                    toolbar:
                        "undo redo | formatselect | bold italic underline | " +
                        "alignleft aligncenter alignright alignjustify | " +
                        "bullist numlist outdent indent | removeformat | help",
                }}
                onEditorChange={handleEditorChange}
            />
        </Box>
    );
};

export default HtmlEditor;