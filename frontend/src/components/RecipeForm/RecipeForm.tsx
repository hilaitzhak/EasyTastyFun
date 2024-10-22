import React, { useState } from 'react';
import { Form, Input, Button, message, Upload, GetProp } from 'antd';
import { UploadFile, UploadProps } from 'antd/es/upload/interface';
import ImgCrop from 'antd-img-crop';
import { recipeApi } from '../../api/recipe-api';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const RecipeForm: React.FC<{ onRecipeAdded: () => void }> = ({ onRecipeAdded }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const onFinish = async (values: any) => {
        try {
            const formData = new FormData();
            formData.append('title', values.title);
            formData.append('description', values.description);
            formData.append('ingredients', values.ingredients);
            formData.append('instructions', values.instructions);
            
            if (fileList.length > 0) {
                formData.append('image', fileList[0].originFileObj as FileType);  // Add the image to the form data
            }
            
            console.log('Sending Form Data:', {
                title: values.title,
                description: values.description,
                ingredients: values.ingredients,
                instructions: values.instructions,
                image: fileList.length > 0 ? fileList[0].originFileObj : null,
            });

            await recipeApi.create(formData);
            form.resetFields();
            setFileList([]);  // Clear the uploaded image list
            onRecipeAdded();
            message.success('Recipe created successfully!');
        } catch (error) {
            console.error("Failed to create recipe:", error);
            message.error('Failed to create recipe. Please try again.');
        }
    };

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    };

    const uploadProps: UploadProps = {
        onRemove: (file) => {
            setFileList([]);
        },
        beforeUpload: (file) => {
            setFileList([file]);
            return false; // Prevent automatic upload
        },
        fileList,
    };


    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
                <Input />
            </Form.Item>
            <Form.Item name="ingredients" label="Ingredients" rules={[{ required: true }]}>
                <Input.TextArea />
            </Form.Item>
            <Form.Item name="instructions" label="Instructions" rules={[{ required: true }]}>
                <Input.TextArea />
            </Form.Item>
            <Form.Item label="Upload Image">
                <ImgCrop rotationSlider>
                    <Upload {...uploadProps} listType="picture-card" fileList={fileList}  onChange={onChange}         
                        action="http://localhost:4000/easy-tasty-fun/add-recipe">
                        {fileList.length < 5 && '+ Upload'}
                    </Upload>
                </ImgCrop>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">
                    Add Recipe
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RecipeForm;
