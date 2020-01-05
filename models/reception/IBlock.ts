import { ISlide } from './ISlide';

export interface IBlock {
    Id: number,
    SampleId?: number
    Detail?: string
    Slides?: ISlide[]
}