import React, {useEffect, useState} from 'react';
import {Box} from '@mui/material';
import Editor from '@tinymce/tinymce-react';

const HtmlEditor = ({value, onChange}) => {
    const [editorContent, setEditorContent] = useState(value);

    useEffect(() => {
        setEditorContent(value);
    }, [value]);

    const handleEditorChange = (content) => {
        setEditorContent(content);
        onChange(content);
    };

    return (<Box sx={{mt: 2}}>
        <Editor
            apiKey="your-tinymce-api-key" // Замените на ваш API ключ
            value={editorContent}
            init={{
                height: 500, menubar: true, plugins: `
                    
                        advlist autolink lists link image charmap print preview anchor |
                        searchreplace visualblocks code fullscreen |
                        insertdatetime media table paste code help wordcount
                        `,
                toolbar: `
                          undo redo | formatselect | bold italic backcolor |
                          alignleft aligncenter alignright alignjustify |
                          bullist numlist outdent indent | removeformat | help
                        `
            }}
            onEditorChange={handleEditorChange}
        />
    </Box>);
};

export default HtmlEditor;