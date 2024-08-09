export default interface Result<T> {
    error?: string;
    errorCode?: number;
    data?: T | T[];
}