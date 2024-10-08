const InputField = ({ id, name, type, placeholder, value, onChange }) => (
    <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
        value={value}
        onChange={onChange}
    />
);

export default InputField;
