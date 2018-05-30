export declare class BaseController {
    /**
     * 返回正确的数据
     * @param _data
     */
    ok<T>(_data: T): IResult<T>;
    /**
     *
     * @param _msg 数据异常数据
     * @param _data
     */
    bad<T>(_msg?: string, _data?: T): IResult<T>;
}
