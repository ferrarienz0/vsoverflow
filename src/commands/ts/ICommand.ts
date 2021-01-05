export default interface ICommand<T> {
  command: string;
  callback(): Promise<T> | T;
}
