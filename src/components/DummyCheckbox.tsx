import { useState } from "react"

function DummyCheckbox() {
    const [isChecked, setIsChecked] = useState(false);

    return <div>
        <div
            onClick={() => {
                if(isChecked === true) {
                    setIsChecked(false);
                } else {
                    setIsChecked(true);
                }
            }}
        >
            {isChecked ? 'x' : ''};
        </div>
    </div>
}

export default DummyCheckbox;