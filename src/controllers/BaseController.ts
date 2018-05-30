export class BaseController {
    /**
     * 返回正确的数据
     * @param _data 
     */
    public ok<T>(_data: T): IResult<T> {
        return {
            ret: 1,
            msg: 'ok',
            data: _data
        }
    }
    /**
     * 
     * @param _msg 数据异常数据
     * @param _data 
     */
    public bad<T>(_msg?: string, _data?: T): IResult<T> {

        return {
            ret: 0,
            msg: _msg || '',
            data: _data
        };
    }
}