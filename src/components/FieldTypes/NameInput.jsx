import React from 'react';
const NameInput = ({ field, isPreview, value, onChange }) => {
    const currentNameValue = value || { first: '', last: '' };
    const handleChange = (e, subKey) => {
        if (onChange) {
            const newValue = {
                ...currentNameValue,
                [subKey]: e.target.value,
            };
            onChange(field.id, newValue);
        }
    };
    return (
        <div className="form-field-render name-field">
            <label>
                {field.label} {field.required && <span className="required-star">*</span>}
            </label>
            <div className="multi-input-group">
                {field.subFields.map((sub) => (
                    <div key={sub.key} className="sub-field-item">
                        <label>
                            {sub.label} {sub.required && <span className="required-star">*</span>}
                        </label>
                        <input
                            type="text"
                            placeholder={sub.placeholder}
                            disabled={!isPreview}
                            value={currentNameValue[sub.key] || ''}
                            onChange={(e) => handleChange(e, sub.key)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};
export default NameInput;