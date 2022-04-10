import React from 'react'

export default function SelectInput(props) {

    const handleChange = (e) => {
        props.select(e.target[e.target.selectedIndex].getAttribute('id'))
    }

    return (
        <>
            <select
                name="select-input"
                id="select-input"
                placeholder={props.label}
                onChange={(e) => handleChange(e)}
            >
                <option disabled>
                    Selecione uma {props.placeholder}
                    </option>
                {
                    props?.options?.map((item) => {
                        return <option
                            selected={item.id === props.selectedId}
                            key={`select-input${item.id}`}
                            value={item.item}
                            id={item.id}>
                            {item.name}
                        </option>
                    })
                }
            </select>
        </>
    )
}