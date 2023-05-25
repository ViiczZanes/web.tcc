
import { InputHTMLAttributes } from 'react';

// Style
import styles from './Input.module.scss';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error: string
}




function Input({ error, ...rest }: InputProps) {
  const style = error ? { border: '1px solid var(--red-900)' } : null

  return (
    <input className={styles.input} style={style} {...rest} />
  )
}


export {
  Input
}