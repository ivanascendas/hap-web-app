export interface PaggingBaseDto {
    $inlinecount: string;
    $orderby: string;
    $skip: number;
    $top: number;
}