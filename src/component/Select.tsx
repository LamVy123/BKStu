
interface SelectProps {
    id: string,
    name: string,
    height: number,
    option: OptionInterface[],
    className?: string,
    disable?: boolean,
    required?: boolean
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export interface OptionInterface {
    lable: string,
    value: string,
}

const Select: React.FC<SelectProps> = ({ name, id, option, className, height, disable, required, onChange }: SelectProps) => {

    const defaultClassName = "bg-white border-2 border-solid border-black rounded-md p-2 outline-none focus:border-transparent focus:outline-blue-300 focus:outline-2 focus:ring-2 focus:ring-blue-300 disabled:border-gray-300"

    return (
        <select
            onChange={onChange}
            name={name} id={id} className={defaultClassName + " " + className}
            style={{ height: `${height * 4}px` }} disabled={disable} required={required} >
            {option.map((option) => {
                return (
                    <option key={option.value} value={option.value}>
                        {option.lable}
                    </option>
                )
            })}
        </select >
    )
}

export default Select