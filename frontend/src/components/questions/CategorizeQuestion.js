import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
    ITEM: 'item'
};

const DraggableItem = ({ item, index, onDropItem, categories }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.ITEM,
        item: { index, item },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    return (
        <div
            ref={drag}
            className={`p-2 mb-2 bg-white border rounded cursor-move ${isDragging ? 'opacity-50' : ''}`}
        >
            <div className="flex items-center justify-between">
                <span>{item}</span>
            </div>
        </div>
    );
};

const CategoryContainer = ({ category, items, onDropItem }) => {
    const [, drop] = useDrop({
        accept: ItemTypes.ITEM,
        drop: (draggedItem) => onDropItem(draggedItem.item, category),
    });

    return (
        <div
            ref={drop}
            className="p-4 bg-gray-100 border-2 border-gray-300 rounded-lg"
        >
            <h3 className="font-bold mb-2">{category}</h3>
            {items.map((item, index) => (
                <div key={index} className="p-2 mb-2 bg-white border rounded">
                    {item}
                </div>
            ))}
        </div>
    );
};

export const CategorizeQuestionEditor = ({ question, updateOptions }) => {
    const [categories, setCategories] = useState(question.options.categories || []);
    const [items, setItems] = useState(question.options.items || []);
    const [itemCategories, setItemCategories] = useState(question.options.itemCategories || {});
    const [newCategory, setNewCategory] = useState('');
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        updateOptions({ categories, items, itemCategories });
    }, [categories, items, itemCategories, updateOptions]);

    const addCategory = () => {
        if (newCategory.trim() !== '') {
            setCategories([...categories, newCategory.trim()]);
            setNewCategory('');
        }
    };

    const addItem = () => {
        if (newItem.trim() !== '') {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const removeCategory = (index) => {
        const newCategories = categories.filter((_, i) => i !== index);
        setCategories(newCategories);

        const newItemCategories = { ...itemCategories };
        Object.keys(newItemCategories).forEach(key => {
            if (newItemCategories[key] === categories[index]) {
                delete newItemCategories[key];
            }
        });
        setItemCategories(newItemCategories);
    };

    const removeItem = (index) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);

        const newItemCategories = { ...itemCategories };
        delete newItemCategories[items[index]];
        setItemCategories(newItemCategories);
    };

    const handleCategoryChange = (itemIndex, category) => {
        const item = items[itemIndex];
        const newItemCategories = { ...itemCategories };
        if (category) {
            newItemCategories[item] = category;
        } else {
            delete newItemCategories[item];
        }
        setItemCategories(newItemCategories);
    };

    return (
        <div>
            <div className="mb-4">
                <h3 className="font-bold">Categories:</h3>
                <div className="flex items-center mb-2">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-grow p-2 border rounded mr-2"
                        placeholder="New category"
                    />
                    <button onClick={addCategory} className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add
                    </button>
                </div>
                <ul className="space-y-2">
                    {categories.map((category, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                            <span>{category}</span>
                            <button onClick={() => removeCategory(index)} className="text-red-500">
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="mb-4">
                <h3 className="font-bold">Items:</h3>
                <div className="flex items-center mb-2">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className="flex-grow p-2 border rounded mr-2"
                        placeholder="New item"
                    />
                    <button onClick={addItem} className="bg-green-500 text-white px-4 py-2 rounded">
                        Add
                    </button>
                </div>
                <div className="space-y-2">
                    {items.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                            <span>{item}</span>
                            <select
                                value={itemCategories[item] || ''}
                                onChange={(e) => handleCategoryChange(index, e.target.value)}
                                className="ml-2 p-1 border rounded"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category, idx) => (
                                    <option key={idx} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export const CategorizeQuestionRenderer = ({ question, answer, onChange }) => {
    const [categorizedItems, setCategorizedItems] = useState(() => {
        const initialState = {};
        question.options.categories.forEach(category => {
            initialState[category] = [];
        });
        initialState['uncategorized'] = [...question.options.items];
        return initialState;
    });

    useEffect(() => {
        const newAnswer = {};
        Object.entries(categorizedItems).forEach(([category, items]) => {
            items.forEach(item => {
                if (category !== 'uncategorized') {
                    newAnswer[item] = category;
                }
            });
        });
        onChange(newAnswer);
    }, [categorizedItems, onChange]);

    const onDropItem = (item, targetCategory) => {
        setCategorizedItems(prev => {
            const newState = { ...prev };

            const uncategorizedIndex = newState['uncategorized'].indexOf(item);
            if (uncategorizedIndex !== -1) {
                newState['uncategorized'].splice(uncategorizedIndex, 1);
            }

            if (newState[targetCategory]) {
                newState[targetCategory].push(item);
            } else {
                newState[targetCategory] = [item];
            }

            return newState;
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 border-2 border-gray-300 rounded-lg">
                    <h3 className="font-bold mb-2">Items</h3>
                    {categorizedItems['uncategorized'].map((item, index) => (
                        <DraggableItem
                            key={index}
                            item={item}
                            index={index}
                            onDropItem={onDropItem}
                            categories={question.options.categories}
                        />
                    ))}
                </div>
                {question.options.categories.map(category => (
                    <CategoryContainer
                        key={category}
                        category={category}
                        items={categorizedItems[category] || []}
                        onDropItem={onDropItem}
                    />
                ))}
            </div>
        </DndProvider>
    );
};
