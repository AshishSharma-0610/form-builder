import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
    WORD: 'word'
};

const DraggableWord = ({ word, index }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.WORD,
        item: { word, index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className={`inline-block p-2 m-1 bg-blue-100 border border-blue-300 rounded cursor-move ${isDragging ? 'opacity-50' : ''
                }`}
        >
            {word}
        </div>
    );
};

const BlankSpace = ({ index, word, onDrop }) => {
    const [{ isOver }, drop] = useDrop({
        accept: ItemTypes.WORD,
        drop: (item) => onDrop(item.word, index),
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    });

    return (
        <span
            ref={drop}
            className={`inline-block w-24 p-1 mx-1 border-b-2 ${isOver ? 'border-blue-500' : 'border-gray-300'
                }`}
        >
            {word || ''}
        </span>
    );
};

export const ClozeQuestionEditor = ({ question, updateOptions }) => {
    const [sentence, setSentence] = useState(question.options.sentence || '');
    const [blanks, setBlanks] = useState(question.options.blanks || []);

    useEffect(() => {
        updateOptions({ sentence, blanks });
    }, [sentence, blanks, updateOptions]);

    const handleSentenceChange = (e) => {
        const newSentence = e.target.value;
        setSentence(newSentence);
        const newBlanks = newSentence.match(/\{(.+?)\}/g) || [];
        setBlanks(newBlanks.map(blank => blank.slice(1, -1)));
    };

    return (
        <div>
            <div className="mb-4">
                <label className="block mb-2 font-bold">Sentence (use {'{'}{'}'} for blanks):</label>
                <textarea
                    value={sentence}
                    onChange={handleSentenceChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                    placeholder="The {cat} sat on the {mat}."
                />
            </div>
            <div className="mb-4">
                <h3 className="font-bold">Blanks:</h3>
                <ul className="list-disc pl-5">
                    {blanks.map((blank, index) => (
                        <li key={index}>{blank}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export const ClozeQuestionRenderer = ({ question, answer, onChange }) => {
    const [currentAnswer, setCurrentAnswer] = useState(answer || {});

    useEffect(() => {
        onChange(currentAnswer);
    }, [currentAnswer, onChange]);

    const handleDrop = (word, index) => {
        setCurrentAnswer(prev => ({
            ...prev,
            [index]: word
        }));
    };

    const renderSentence = () => {
        const parts = question.options.sentence.split(/\{(.+?)\}/g);
        return parts.map((part, index) => {
            if (index % 2 === 0) {
                return <span key={index}>{part}</span>;
            } else {
                return (
                    <BlankSpace
                        key={index}
                        index={index}
                        word={currentAnswer[index]}
                        onDrop={handleDrop}
                    />
                );
            }
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="mb-4">
                {renderSentence()}
            </div>
            <div className="flex flex-wrap">
                {question.options.blanks.map((word, index) => (
                    <DraggableWord key={index} word={word} index={index} />
                ))}
            </div>
        </DndProvider>
    );
};

