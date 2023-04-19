import {useEffect} from "react";
import {useNavigate} from "@@/exports";

const Index = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/blog/project')
    }, [])
}


export default Index