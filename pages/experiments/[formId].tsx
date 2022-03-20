import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {z, object, string, TypeOf, array} from "zod";
import { useState, useEffect } from 'react';
import router from "next/router"
import ExperimentData from "../../data"
import axios from "axios"

const createQuestionSchema = object({
    question: string({
        required_error: "question is required"
    }),
    type: z.enum(["Single", "Multi", "Optional"]),
    options: string().array().optional(),
}).array()

const question = object({
    question : string(),
    answer : string().nonempty({
        message: 'Answer is required'
    })
});

const createFormSchema = object({
    name: string().nonempty({
        message: "Name is required",
    }),
    email: string({
        required_error: "email is required"
    }).email("Not a valid email")
    .nonempty({
        message: "email is required",
    }),
    phone: string().refine((val) => !Number.isNaN(parseInt(val, 10)), {
        message: "Expected number, received a string"
    }),
    questionAnswer: array(question),
})

export type CreateFormInput = TypeOf< typeof createFormSchema>;
type CreateQuestionInput = TypeOf<typeof createQuestionSchema>;
function FormPage({query} : {query: any}){
    const data =  ExperimentData.find(value => value.experiment.id === query.formId);
    const [questions, setQuestions] = useState<CreateQuestionInput>([]);
    const [formSubmitError, setFormSubmitError] = useState<any>();
    const {setValue, register, handleSubmit, formState: { errors }} = useForm<CreateFormInput>({
        resolver: zodResolver(createFormSchema),
    });
    useEffect(() => {  
        getExperiment();
    }, [])

    const getExperiment = async () => {
        try{
            const questions = await axios.get('http://localhost:3365/api/getQuestions/query.formId')
            setQuestions(questions?.data);
        }
        catch(err){
            console.log(err)
        }
    }

    const onSubmit = async (values : CreateFormInput) => {
        try{
            let formData : any = values
            formData.phone = parseInt(formData.phone);
            await axios.post('http://localhost:3365/api/formResponses',
            formData
            )
            router.push('/experiments/thankyou')
            console.log(formData)
        }
        catch(err){
            console.log(err)
        }
    }
    
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-element">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" placeholder="Your Name" {...register("name")}/>
                    {errors.name ? <p>{errors.name?.message}</p> : ""}
                </div>
                <div className="form-element">
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" placeholder="aman.singh@example.com" {...register("email")}/>
                    {errors.email ? <p>{errors.email?.message}</p> : "" }
                </div>
                <div className="form-element">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" type="number" placeholder="0123456789" {...register("phone")}/>
                    {errors.phone ? <p>{errors.phone?.message}</p> : "" }
                </div>
                {
                    questions?.map((values, idx) =>
                        <div className="form-element" key={idx}>
                            <label id = {`questionAnswer.${idx}.question`}  htmlFor="question" {...register(`questionAnswer.${idx}.question`)}
                            { ...setValue(`questionAnswer.${idx}.question`, values.question )}>{values.question}</label>
                            {values.type == "Optional" ? <div className="select">
                            <select id = {`question${idx}number`} {...register(`questionAnswer.${idx}.answer`)}>
                                {values.options?.map((value : any, idx : number) => <option key = {idx} value={value}>{value}</option>)}
                            </select>
                            <span className="focus"></span>
                            </div> : ""}
                            {values.type == "Single" ? <input id={`questions.${idx}.answer`} type="string" placeholder="Answer Please" {...register(`questionAnswer.${idx}.answer`)} /> : ""}
                            {values.type == "Multi" ? 
                            <textarea id={`questions.${idx}.answer`} rows = {5} cols = {60} placeholder = "Enter details here..." {...register(`questionAnswer.${idx}.answer`)}/> : ""}
                            {errors.questionAnswer ? <p>{errors.questionAnswer[idx]?.answer?.message}</p> : "" }
                        </div>
                    )
                }
                <button type= "submit">SUBMIT</button>
                {formSubmitError && formSubmitError}
            </form>
        </>
    );
}

FormPage.getInitialProps = ({ query } : {query: any}) => {
    return { query }
}


export default FormPage