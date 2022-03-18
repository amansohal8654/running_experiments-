import {useForm} from 'react-hook-form'
import {zodResolver} from '@hookform/resolvers/zod'
import {object, string, TypeOf, array} from "zod";
import { useState } from 'react';
import  Link from "next/link"
import ExperimentData from "../data"


const question = object({
    ques : string().nonempty({
        message: 'Question is required'
    }),
    answers : string().nonempty({
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
    questions: array(question),
})

export type CreateFormInput = TypeOf< typeof createFormSchema>;

function FormPage({query}){
    const data =  ExperimentData.find(value => value.experiment.id === query.formId);
    const [questions, _] = useState(data);

    const {register, handleSubmit, formState: { errors }} = useForm<CreateFormInput>({
        resolver: zodResolver(createFormSchema),
    });

    const onSubmit = (values : CreateFormInput) => {
        console.log({values})
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
                    <input id="phone" type="tel" placeholder="0123456789" {...register("phone")}/>
                    {errors.phone ? <p>{errors.phone?.message}</p> : "" }
                </div>
                {
                    questions?.experiment.questions.map((values, idx) =>
                        <div className="form-element" key={idx}>
                            <label htmlFor="phone">{values.Q}</label>
                            {values.type == "Options" ? <div className="select">
                            <select id="standard-select">
                                {values.options?.map((value : any, idx : number) => <option key = {idx} value={value}>{value}</option>)}
                            </select>
                            <span className="focus"></span>
                            </div> : ""}
                            {values.type == "Single" ? <input id="Ans" type="string" placeholder="Answer Please" /> : ""}
                            {values.type == "Multi" ? 
                            <textarea rows = {5} cols = {60} name = "description" defaultValue = "Enter details here..."/> : ""}
                        </div>
                    )
                }
                <Link href = "/experiments/thankyou">
                    <button type= "submit">SUBMIT</button>
                </Link>
            </form>
        </>
    );
}

FormPage.getInitialProps = ({ query }) => {
    return { query }
}


export default FormPage