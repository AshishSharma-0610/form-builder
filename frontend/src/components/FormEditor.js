
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CategorizeQuestionEditor } from './questions/CategorizeQuestion';
import { ClozeQuestionEditor } from './questions/ClozeQuestion';
import { ComprehensionQuestionEditor } from './questions/ComprehensionQuestion';
import FileUpload from './FileUpload';

const FormEditor = () => {
    const [form, setForm] = useState({
        title: '',
        headerImage: '',
        questions: []
    });
    const [formId, setFormId] = useState(null);
    const navigate = useNavigate();

    const addQuestion = (type) => {
        setForm(prevForm => ({
            ...prevForm,
            questions: [...prevForm.questions, { type, question: '', image: '', options: {} }]
        }));
    };

    const updateQuestion = (index, field, value) => {
        setForm(prevForm => {
            const newQuestions = [...prevForm.questions];
            newQuestions[index] = { ...newQuestions[index], [field]: value };
            return { ...prevForm, questions: newQuestions };
        });
    };

    const moveQuestion = (index, direction) => {
        if (
            (direction === 'up' && index === 0) ||
            (direction === 'down' && index === form.questions.length - 1)
        ) {
            return;
        }

        const newQuestions = [...form.questions];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];

        setForm(prevForm => ({ ...prevForm, questions: newQuestions }));
    };

    const saveForm = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/forms', form);
            setFormId(response.data._id);
            alert('Form saved successfully!');
        } catch (error) {
            console.error('Error saving form:', error);
            alert('Error saving form. Please try again.');
        }
    };

    const viewForm = () => {
        if (formId) {
            // navigate(`/form/${formId}`);
            window.location.href = `/form/${formId}`;
        } else {
            alert('Please save the form first.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Form Editor</h1>
            <input
                type="text"
                placeholder="Form Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full p-2 mb-4 border rounded"
            />
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Image
                </label>
                <FileUpload
                    onFileSelect={(imageData) => setForm({ ...form, headerImage: imageData })}
                />
            </div>
            <div className="mb-4">
                <button onClick={() => addQuestion('Categorize')} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Add Categorize</button>
                <button onClick={() => addQuestion('Cloze')} className="bg-green-500 text-white px-4 py-2 rounded mr-2">Add Cloze</button>
                <button onClick={() => addQuestion('Comprehension')} className="bg-yellow-500 text-white px-4 py-2 rounded">Add Comprehension</button>
            </div>
            {form.questions.map((question, index) => (
                <div key={index} className="mb-4 p-4 border rounded bg-white shadow-md">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold">{question.type} Question</h2>
                        <div>
                            <button
                                onClick={() => moveQuestion(index, 'up')}
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded mr-2"
                                disabled={index === 0}
                            >
                                ↑
                            </button>
                            <button
                                onClick={() => moveQuestion(index, 'down')}
                                className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                                disabled={index === form.questions.length - 1}
                            >
                                ↓
                            </button>
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="Question"
                        value={question.question}
                        onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Image
                        </label>
                        <FileUpload
                            onFileSelect={(imageData) => updateQuestion(index, 'image', imageData)}
                        />
                    </div>
                    {question.type === 'Categorize' && (
                        <CategorizeQuestionEditor
                            question={question}
                            updateOptions={(options) => updateQuestion(index, 'options', options)}
                        />
                    )}
                    {question.type === 'Cloze' && (
                        <ClozeQuestionEditor
                            question={question}
                            updateOptions={(options) => updateQuestion(index, 'options', options)}
                        />
                    )}
                    {question.type === 'Comprehension' && (
                        <ComprehensionQuestionEditor
                            question={question}
                            updateOptions={(options) => updateQuestion(index, 'options', options)}
                        />
                    )}
                </div>
            ))}
            <div className="mt-4">
                <button onClick={saveForm} className="bg-purple-500 text-white px-4 py-2 rounded mr-2">Save Form</button>
                <button onClick={viewForm} className="bg-green-500 text-white px-4 py-2 rounded">View Form</button>
            </div>
        </div>
    );
};

export default FormEditor;
