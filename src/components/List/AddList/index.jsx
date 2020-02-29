import React, { useState, useEffect } from 'react';
import List from '..';
import Badge from './../../Badge/index';
import axios from 'axios';

import closeSvg from '../../../assets/img/close.svg'

import './AddButtonList.scss';


const AddList = ({ colors, onAdd }) => {

    const [visiblePopup, setVisiblePopup] = useState(false);
    const [selectedColor, selectColor] = useState(3);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (Array.isArray(colors)) {
            selectColor(colors[0].id);
        }
    }, [colors])

    const onClose = () => {
        setInputValue('');
        selectColor(colors[0].id);
        setVisiblePopup(false);
    }

    const addList = () => {
        if (!inputValue) {
            alert('Введите название списка');
            return
        }
        setIsLoading(true);
        axios.post('http://localhost:3001/lists', { name: inputValue, colorId: selectedColor })
            .then(({ data }) => {
                const color = colors.filter(c => c.id === selectedColor)[0]
                const listObj = { ...data, color, tasks: [] };
                onAdd(listObj);
                onClose();
            })
            .catch(() => {
                alert('Ощибка при добавлении списка');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    return (
        <div className="add-list">
            <List
                onClick={() => setVisiblePopup(true)}
                items={[
                    {
                        className: "list__add-button",
                        icon: (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6 1V11" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M1 6H11" stroke="#868686" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ),
                        color: 'green',
                        name: 'Добавить список'
                    }
                ]} />

            {visiblePopup &&
                <div className='add-list__popup'>
                    <img onClick={onClose}
                        className="add-list__popup-close-btn"
                        src={closeSvg}
                        alt="close-icon" />
                    <input className="field"
                        type="text"
                        placeholder="Название списка"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)} />
                    <div className="add-list__popup-colors">
                        {
                            colors.map(color => (
                                <Badge
                                    key={color.id}
                                    onClick={() => selectColor(color.id)}
                                    color={color.name}
                                    className={selectedColor === color.id && 'active'} />
                            ))
                        }
                    </div>
                    <button onClick={addList} className="button">
                        {isLoading
                            ? 'Добавление'
                            : 'Добавить'}

                    </button>
                </div>
            }
        </div>
    );
}

export default AddList;