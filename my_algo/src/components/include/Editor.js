import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import toast  from 'react-hot-toast' 
import Table_Loader from "./TableLoader";

const TinyMCEEditor = ({ handleEditorChange, val,isEditorShow }) => {
    const editorRef = useRef(null);
    // const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // const isSmallScreen = window.matchMedia('(max-width: 1023.5px)').matches;
    const [isEditorReady, setIsEditorReady] = useState(!isEditorShow);

    const handleEditorInit = () => {
        setTimeout(() => {
            setIsEditorReady(true);
        }, 100);
    };

    return (
        <div className="tiny-editor-div">
            {!isEditorReady ? <div className="editor-loading text-center p-4">
                <Table_Loader />
            </div> :
                 <Editor
                 apiKey="kpdqyqtix1ync4w86knxqxc9hs9qn643qhpqf51g5e2o5km3"
                 value={val}
 
                 // initialValue={val}
                 init={{
                     skin: "snow",
                     icons: "thick",
                     menubar: true,
                     plugins: [
                         "advlist", "lists", "anchor", "autolink", "autoresize", "autosave", "save",  "charmap", "code", "directionality", "fullscreen",
                         "help addTab",  "insertdatetime", "link",  "nonbreaking", "pagebreak", "quickbars", "wordcount",
                          "searchreplace", "table", "visualblocks", "accordion",  "visualblocks", "visualchars",
                        //  "image","emoticons","media","template", "codesample","preview",
                     ],
                     height: 450,
                     toolbar: "undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent wordcount accordion|  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons |  insertfile  image   media   template | link   code  codesample insertdatetime   | visualchars visualblocks | nonbreaking anchor save print fullscreen  preview  help",
                     toolbar_mode: 'wrap',
                     template_mdate_format: '%m/%d/%Y : %H:%M',
                     template_replace_values: {
                         username: 'Jack Black',
                         staffid: '991234',
                         inboth_username: 'Famous Person',
                         inboth_staffid: '2213',
                     },
                     template_preview_replace_values: {
                         preview_username: 'Jack Black',
                         preview_staffid: '991234',
                         inboth_username: 'Famous Person',
                         inboth_staffid: '2213',
                     },
                     templates: [
                         {
                             title: 'Date modified example',
                             description: 'Adds a timestamp indicating the last time the document modified.',
                             content: '<p>Last Modified: <time class="mdate">This will be replaced with the date modified.</time></p>'
                         },
                         {
                             title: 'Replace values example',
                             description: 'These values will be replaced when the template is inserted into the editor content.',
                             content: '<p>Name: {$username}, StaffID: {$staffid}</p>'
                         },
                         {
                             title: 'Replace values preview example',
                             description: 'These values are replaced in the preview, but not when inserted into the editor content.',
                             content: '<p>Name: {$preview_username}, StaffID: {$preview_staffid}</p>'
                         },
                         {
                             title: 'Replace values preview and content example',
                             description: 'These values are replaced in the preview, and in the content.',
                             content: '<p>Name: {$inboth_username}, StaffID: {$inboth_staffid}</p>'
                         }
                     ],
                     link_class_list: [
                         { title: 'None', value: '' },
                         { title: 'External Link', value: 'ext_link' },
                         {
                             title: 'Internal Links',
                             menu: [
                                 { title: 'Internal Support Link', value: 'int_sup_link' },
                                 { title: 'Internal Marketing Link', value: 'int_mark_link' },
                                 { title: 'Other Internal Link', value: 'int_other_link' }
                             ]
                         }
                     ],
                     quickbars_insert_toolbar: 'quicktable image media codesample',
                     image_title: true,
                     file_picker_types: 'image',
                     images_upload_max_size: 2 * 1024 * 1024,
                     paste_block_drop: true,
                     file_picker_callback: (cb, value, meta) => {
                         const input = document.createElement('input');
                         input.setAttribute('type', 'file');
                         input.setAttribute('accept', 'image/*');
 
                         input.addEventListener('change', (e) => {
                             const fileInput = e.target;
                             const file = fileInput.files && fileInput.files[0];
                             if (!file) {
                                 return;
                             }
                             if (file.size > 2 * 1024 * 1024) {
                                 toast.error("Image size exceeds the maximum limit of 2 MB.");
                                 return;
                             }
                             const reader = new FileReader();
                             reader.addEventListener('load', () => {
                                 if (typeof reader.result === 'string') {
                                     const base64 = reader.result.split(',')[1];
                                     const id = 'blobid' + (new Date()).getTime();
                                     const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                     const blobInfo = blobCache.create(id, file, base64);
                                     blobCache.add(blobInfo);
                                     cb(blobInfo.blobUri(), { title: file.name });
                                 } else {
                                     const arrayBuffer = reader.result;
                                     const uint8Array = new Uint8Array(arrayBuffer);
                                     console.log(uint8Array);
                                 }
                             });
 
                             reader.readAsDataURL(file);
                         });
 
                         input.click();
                     },
                     toolbar_sticky: true,
                     // toolbar_sticky_offset: isSmallScreen ? 102 : 108,
                     autosave_ask_before_unload: true,
                     autosave_retention: '2m',
                     autosave_interval: '30s',
                     content_style: `body { overflow-y: auto !important; min-height: 300px;height: 300px;color:white;background-color: #3a425000; overflow: auto; ${!isEditorReady ? { "display": "none" } : ''}}`,
                     body_class: 'tinymce-scrollable',
                     // content_style: "body {height: 250px; }"
                     setup: (editor) => {
                         editor.on('init', handleEditorInit);
                     }
                 }}
                 onEditorChange={handleEditorChange}
                 ref={editorRef}
             />
                }

           
        </div>
    );
};

export default TinyMCEEditor;
