const Input = ({ className = "", ...props }) => {
  return (
    <input
      className={`w-full p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-200 ${className}`}
      {...props}
    />
  );
};

export default Input;
