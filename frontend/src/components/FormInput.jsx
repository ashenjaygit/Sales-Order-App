import React from 'react';

const FormInput = ({ label, type = "text", value, onChange, readOnly = false, className = "" }) => {
    return (
        <div className="flex items-center">
            <label className="w-32 text-sm font-semibold text-gray-700">{label}</label>
            <input 
                type={type}
                className={`flex-1 border p-2 border-gray-300 rounded ${readOnly ? 'bg-gray-100' : 'bg-white'} ${className}`} 
                value={value} 
                onChange={onChange} 
                readOnly={readOnly} 
            />
        </div>
    );
};

export default FormInput;
