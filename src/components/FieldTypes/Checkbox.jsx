import React from 'react';
import { useDispatch } from 'react-redux';
import { updateField } from '../../redux/actions';
const Checkbox = ({ field, isPreview, value, onChange }) => {
    const dispatch = useDispatch();
    const currentValues = isPreview && Array.isArray(value) ? value : [];
    const handleCheckboxChange = (e) => {
        if (onChange) {
            const optionValue = e.target.value;
            let newValues;
            if (e.target.checked) {
                newValues = [...currentValues, optionValue];
            } else {
                newValues = currentValues.filter(val => val !== optionValue);
            }
            onChange(field.id, newValues);
        }
    };
    const handleOptionLabelChange = (e, optionIndex) => {
        if (!isPreview) {
            const newLabel = e.target.innerText;
            const newOptions = field.options.map((opt, i) => 
                i === optionIndex ? { ...opt, label: newLabel } : opt
            );
            dispatch(updateField(field.id, { options: newOptions }));
            e.preventDefault();
        }
    };
    const handleAddOption = () => {
        const currentOptions = field.options || [];
        const newOptionIndex = currentOptions.length + 1;
        const newOption = {
            label: `Option ${newOptionIndex}`,
            value: `option_${field.id}_${newOptionIndex}`,
        };
        dispatch(updateField(field.id, { 
            options: [...currentOptions, newOption] 
        }));
    };
    return (
        <div className="form-field-render checkbox-field">
            <label>
                {field.label} {field.required && <span className="required-star">*</span>}
            </label>
            {field.options && field.options.map((option, index) => (
                <div key={option.value || index} className="option-item">
                    <input
                        type="checkbox"
                        name={field.id}
                        id={`${field.id}-${index}`}
                        value={option.value}
                        disabled={!isPreview}
                        checked={isPreview ? currentValues.includes(option.value) : false}
                        onChange={handleCheckboxChange}
                    />
                    <label 
                        htmlFor={`${field.id}-${index}`}
                        contentEditable={!isPreview}
                        suppressContentEditableWarning={true}
                        onBlur={(e) => handleOptionLabelChange(e, index)}
                        className={!isPreview ? 'editable-option-label' : ''}
                    >
                        {option.label}
                    </label>
                </div>
            ))}
            {}
            {(!field.options || field.options.length === 0) && (
                <p style={{ fontSize: '0.85em', color: '#999' }}>No options defined. Edit field to add options.</p>
            )}
            {}
            {!isPreview && (
                <button 
                    onClick={handleAddOption}
                    className="mt-2 text-sm text-blue-500 hover:text-blue-700 transition-colors p-1"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                >
                    <i className="fas fa-plus-circle mr-1"></i> Add Option
                </button>
            )}
        </div>
    );
};
export default Checkbox;
