import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addField, reorderFields } from '../redux/actions';
import FormField from './FormField';
const STORAGE_KEY = 'customFormData';
const FormBuilder = () => {
    const dispatch = useDispatch();
    const formSchema = useSelector((state) => state.form.formFields);
    const formFields = formSchema;
    const draggingFieldType = useSelector((state) => state.form.draggingFieldType);
    const [dropIndicatorIndex, setDropIndicatorIndex] = useState(-1);
    const [isReordering, setIsReordering] = useState(false);
    const [draggedFieldIndex, setDraggedFieldIndex] = useState(null);
    const [isPreviewMode, setIsPreviewMode] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState('#f8f9fa');
    const [isLoading, setIsLoading] = useState(true);
    const [formValues, setFormValues] = useState({});
    const colorOptions = ['#e0f2fe', '#d1fae5', '#fef3c7', '#fee2e2'];
    const handleColorChange = (color) => {
        setBackgroundColor(color);
    };
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);
    useEffect(() => {
        const storedValues = localStorage.getItem(STORAGE_KEY);
        if (storedValues) {
            setFormValues(JSON.parse(storedValues));
        }
    }, []);
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(formValues));
    }, [formValues]);
    const handleValueChange = (fieldId, newValue) => {
        setFormValues(prevValues => ({
            ...prevValues,
            [fieldId]: newValue,
        }));
    };
    const handleExternalDragOver = (e, index = formFields.length) => {
        e.preventDefault();
        if (draggingFieldType && !isReordering) {
            setDropIndicatorIndex(index);
        }
    };
    const handleExternalDrop = (e, index) => {
        e.preventDefault();
        e.stopPropagation();
        const fieldType = e.dataTransfer.getData('fieldType');
        if (fieldType) {
            dispatch(addField({ type: fieldType, positionIndex: index }));
        }
        setDropIndicatorIndex(-1);
    };
    const handleDragStart = (e, index) => {
        if (isPreviewMode) return;
        e.stopPropagation();
        setIsReordering(true);
        setDraggedFieldIndex(index);
        e.dataTransfer.setData('fieldIndex', index);
        document.body.classList.add('dragging-reorder');
    };
    const handleDragEnter = (e, index) => {
        e.preventDefault();
        if (isReordering && draggedFieldIndex !== index) {
            setDropIndicatorIndex(index);
        }
    };
    const handleDragEnd = () => {
        setIsReordering(false);
        setDraggedFieldIndex(null);
        setDropIndicatorIndex(-1);
        document.body.classList.remove('dragging-reorder');
    };
    const handleReorderDrop = (e, destinationIndex) => {
        e.preventDefault();
        const sourceIndex = parseInt(e.dataTransfer.getData('fieldIndex'));
        if (sourceIndex !== destinationIndex) {
            dispatch(reorderFields(sourceIndex, destinationIndex));
        }
        handleDragEnd();
    };
    const handleDownload = () => {
        const reportData = formSchema.map(field => {
            const rawValue = formValues[field.id] !== undefined
                ? formValues[field.id]
                : field.value || null;
            let displayValue = rawValue;
            if (field.type === 'Radio Button' && rawValue !== null) {
                const selectedOption = field.options?.find(opt => opt.value === rawValue);
                if (selectedOption) {
                    displayValue = selectedOption.label;
                }
            } else if (field.type === 'Checkbox' && Array.isArray(rawValue) && rawValue.length > 0) {
                displayValue = field.options
                    .filter(opt => rawValue.includes(opt.value))
                    .map(opt => opt.label);
            }
            return {
                label: field.label,
                type: field.type,
                required: field.required,
                value: displayValue,
            };
        });
        let reportItems = '';
        reportData.forEach((item, index) => {
            let valueString;
            if (Array.isArray(item.value)) {
                valueString = item.value.length > 0 ? item.value.join(', ') : 'Not selected';
            } else if (item.value !== null && typeof item.value === 'object') {
                const parts = Object.values(item.value)
                    .filter(val => val && typeof val === 'string')
                    .join(' ');
                valueString = parts.length > 0 ? parts : 'No answer provided';
            } else if (item.value === null || item.value === undefined || item.value === '') {
                valueString = 'No answer provided';
            } else {
                valueString = String(item.value);
            }
            reportItems += `
                <div class="field-entry">
                    <div class="field-header">${index + 1}. ${item.label}</div>
                    <div class="field-details">Type: ${item.type} | Required: ${item.required ? 'Yes' : 'No'}</div>
                    <div class="field-response">Response: ${valueString}</div>
                </div>
            `;
        });
        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Form Submission Report</title>
                <style>
                    body { 
                        font-family: sans-serif; 
                        margin: 0; 
                        padding: 20px; 
                        color: #333; 
                        background-color: ${backgroundColor}; 
                    }
                    .report-container { max-width: 800px; margin: 0 auto; }
                    h1 { 
                        color: #1f2937; 
                        background-color: ${backgroundColor}; 
                        border: 1px solid #ccc; 
                        border-radius: 8px; 
                        padding: 15px; 
                        margin-bottom: 30px; 
                        text-align: center; 
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
                    }
                    .field-entry { margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 5px; background-color: white; }
                    .field-header { font-weight: bold; font-size: 1.1em; color: #4b5563; margin-bottom: 5px; }
                    .field-details { font-size: 0.9em; color: #6b7280; margin-bottom: 8px; }
                    .field-response { 
                        margin-top: 10px; 
                        padding: 10px; 
                        background-color: #f9fafb; 
                        border-radius: 3px; 
                        white-space: pre-wrap; 
                        word-wrap: break-word; 
                        border-left: 4px solid #3b82f6; 
                    }
                    @media print {
                        body { background-color: #fff !important; } 
                        .field-entry { 
                            border: 1px solid #ccc;
                            page-break-inside: avoid;
                        }
                        .report-container { margin: 0; max-width: 100%; }
                        h1 { 
                            background-color: ${backgroundColor} !important; 
                            -webkit-print-color-adjust: exact; 
                            color-adjust: exact;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <h1>Form Submission Report</h1>
                    ${reportItems}
                </div>
            </body>
            </html>
        `;
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.onload = () => {
                printWindow.focus();
                printWindow.print();
            };
        } else {
            console.error('Could not open print window. Please allow popups for this site.');
        }
    };
    const togglePreview = () => {
        setIsPreviewMode(!isPreviewMode);
    };
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#1f2937',
                color: '#fff',
                textAlign: 'center',
                fontSize: '1.2rem',
                width: '100%',
            }}>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                {}
                <div style={{
                    width: '100px',
                    height: '100px',
                    border: '10px solid #f3f3f3',
                    borderRadius: '50%',
                    borderTop: '10px solid #3b82f6',
                    animation: 'spin 1.5s linear infinite',
                    marginBottom: '20px',
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)'
                }} />
                <h2 style={{ color: '#fff', margin: '0' }}>Custom Form Builder - (To Edit tap preview)</h2>
                <p style={{ opacity: 0.7, marginTop: '5px' }}>Loading workspace...</p>
            </div>
        );
    }
    return (
        <div className="form-builder-wrapper" style={{ backgroundColor: backgroundColor, transition: 'background-color 0.3s ease' }}>
            <div className={`form-builder-canvas ${isPreviewMode ? 'preview-mode' : ''}`}
                onDragOver={(e) => handleExternalDragOver(e, formFields.length)}
                onDrop={(e) => handleExternalDrop(e, formFields.length)}
                onDragLeave={() => setDropIndicatorIndex(-1)}>
                {}
                <h1>{isPreviewMode ? 'Form Preview' : 'Custom Form Builder - (To Enter Data tap preview)'}</h1>
                {formSchema.map((field, index) => {
                    const currentFieldProps = {
                        field: field,
                        currentValue: formValues[field.id] !== undefined
                            ? formValues[field.id]
                            : (field.value || ''),
                        onValueChange: handleValueChange,
                    };
                    return (
                        <React.Fragment key={field.id}>
                            {}
                            {dropIndicatorIndex === index && !isPreviewMode && <div className="drop-indicator" />}
                            <div
                                className={`field-wrapper ${draggedFieldIndex === index ? 'dragging-source' : ''}`}
                                draggable={!isPreviewMode}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleExternalDragOver(e, index)}
                                onDragEnter={(e) => handleDragEnter(e, index)}
                                onDrop={(e) => isReordering ? handleReorderDrop(e, index) : handleExternalDrop(e, index)}
                                onDragLeave={() => setDropIndicatorIndex(-1)}
                                onDragEnd={handleDragEnd}
                            >
                                {}
                                {isPreviewMode ? (
                                    <FormField.Render {...currentFieldProps} />
                                ) : (
                                    <FormField {...currentFieldProps} />
                                )}
                            </div>
                        </React.Fragment>
                    );
                })}
                {}
                {formFields.length > 0 && dropIndicatorIndex === formFields.length && !isPreviewMode && <div className="drop-indicator" />}
                {formFields.length === 0 && (
                    <div className="empty-form-message">
                        Drag fields from the palette on the left to build your form.
                    </div>
                )}
            </div>
            <div className="builder-actions">
                {}
                <div className="color-selector" style={{
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    marginRight: '20px'
                }}>
                    <span style={{ fontSize: '0.9em', color: '#4b5563', fontWeight: 'bold' }}>Theme:</span>
                    {colorOptions.map((color) => (
                        <div
                            key={color}
                            style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                backgroundColor: color,
                                cursor: 'pointer',
                                boxShadow: backgroundColor === color ? '0 0 0 3px #333' : '0 0 0 1px #ccc',
                                transition: 'box-shadow 0.2s ease, transform 0.1s ease',
                                transform: backgroundColor === color ? 'scale(1.1)' : 'scale(1)',
                            }}
                            onClick={() => handleColorChange(color)}
                        ></div>
                    ))}
                </div>
                <button className="preview-btn" onClick={togglePreview}>
                    <i className="fas fa-eye"></i> {isPreviewMode ? 'Exit Preview' : 'Preview'}
                </button>
                <button className="download-btn" onClick={handleDownload}>
                    <i className="fas fa-print"></i> Print / Save as PDF
                </button>
            </div>
        </div>
    );
};
export default FormBuilder;
