import React,{useContext,useState} from 'react'
import { Form, Button } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth';
import { useForm } from '../util/hooks';

function Login(props) {
    const context = useContext(AuthContext);
    const [errors, setErrors] = useState({}); //emptyh
    
    const { onChange, onSubmit, values } = useForm(loginUserCallback, {
        username:'',
        password:''
        
    });
    
    const [loginUser, { loading }] = useMutation(LOGIN_USER,{
        update(_, /*result*/ {data: {login: userData}}){ //1번쨰 파라는 proxy인데 필요 없으므로 _  
            console.log(/*result.data.login*/userData);
            context.login(userData);
            props.history.push('/');
        },
        onError(err){
            console.log(err.graphQLErrors[0].extensions.errors);
            setErrors(err.graphQLErrors[0].extensions.errors);
        },
        variables:values
    });

    function loginUserCallback(){
        // event.preventDefault();
        loginUser();
    };

    
    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <h1>Login</h1>
                <Form.Input 
                    label='Username'
                    placeholder='Username..'
                    name='username'
                    type='text'
                    value={values.username}
                    error = {errors.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input 
                    label='Password'
                    placeholder='Password..'
                    name='password'
                    type='password'
                    value={values.password}
                    error = {errors.password ? true : false}
                    onChange={onChange}
                />
               
                <Button type='submit' primary>
                    Login
                </Button>
            </Form>
            {/*에러 표현 */}
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map(value =>(
                        <li key={value} >{value}</li> 
                    ))}
                </ul>
            </div>
            )}
            
        </div>
    );
}

const LOGIN_USER = gql`
    mutation login(
        $username:String!
        $password:String!
        
    ){
        login(
            registerInput:{
                username: $username
                password: $password
            }
        ){
            id email username createdAt token
        }
    }
`;

export default Login;
