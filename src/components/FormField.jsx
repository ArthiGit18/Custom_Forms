import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { removeField, updateField } from '../redux/actions';
import ShortAnswer from './FieldTypes/ShortAnswer';
import Paragraph from './FieldTypes/Paragraph';
import RadioButton from './FieldTypes/RadioButton';
import Checkbox from './FieldTypes/Checkbox';
import FieldConfigPanel from './FieldConfigPanel';
import EmailInput from './FieldTypes/EmailInput';
import ContactNumberInput from './FieldTypes/ContactNumberInput';
import NameInput from './FieldTypes/NameInput';
const fieldTypeMap = {
    'Name (First, Last)': NameInput,
    'Email': EmailInput,
    'Contact Number': ContactNumberInput,
    'Short Answer': ShortAnswer,
    'Paragraph': Paragraph,
    'Radio Button': RadioButton,
    'Checkbox': Checkbox,
};
const FormFieldRender = ({ field, currentValue, onValueChange }) => { 
    const FieldComponent = fieldTypeMap[field.type];
    if (!FieldComponent) return <div>Unsupported Field Type</div>;
    return <FieldComponent 
        field={field} 
        isPreview={true}
        value={currentValue}
        onChange={onValueChange}
    />;
};
const FormField = ({ field, currentValue, onValueChange }) => { 
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const FieldComponent = fieldTypeMap[field.type];
    const handleRemove = () => { dispatch(removeField(field.id)); };
    const handleUpdate = (updates) => { dispatch(updateField(field.id, updates)); };
    const toggleEditing = () => { setIsEditing(!isEditing); };
    if (!FieldComponent) return <div>Unsupported Field Type</div>;
    return (
        <div className={`form-field-container ${isEditing ? 'editing' : ''}`} onClick={!isEditing ? toggleEditing : null}>
            <div className="form-field-preview">
                <FieldComponent field={field} isPreview={false} value={currentValue} />
            </div>
            <div className="field-controls">
                <button className="icon-btn edit-btn" onClick={toggleEditing}>
                    <i className="fas fa-cog"></i>
                </button>
                <button className="icon-btn delete-btn" onClick={handleRemove}>
                    <i className="fas fa-trash-alt"></i>
                </button>
            </div>
            {isEditing && (
                <FieldConfigPanel field={field} onUpdate={handleUpdate} onClose={toggleEditing} />
            )}
        </div>
    );
};
FormField.Render = FormFieldRender;
export default FormField;