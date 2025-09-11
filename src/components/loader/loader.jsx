import styles from "./loader.module.scss";

export default function Loader({ width, height }){
  return <div className={ styles.loader } style={{ width: `${ width }px`, height: `${ height }px` }}></div>;
}