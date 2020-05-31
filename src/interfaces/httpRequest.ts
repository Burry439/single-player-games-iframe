export interface HttpHeaders {
    contentType? : string,
    Authorization? : string
}

export interface HttpOptions{
    host? : string,
    port? : string,
    method? : string,
    headers? : HttpHeaders

}