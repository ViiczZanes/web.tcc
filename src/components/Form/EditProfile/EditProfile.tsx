import React from 'react'
import { UserProps } from '../../../pages/users'

import styles from './EditProfile.module.scss'

const EditProfile = () => {

    return (
        <form className={styles.form}>
            <input value={'test'}/>
            <input value={'test'}/>
            <select name="isAdmin">
                <option value="true">true</option>
                <option value="false">false</option>
            </select>
        </form>
    )
}

export default EditProfile