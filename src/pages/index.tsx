import {useEffect} from "react";
import {useNavigate} from "@@/exports";

const Index = () => {
    const navigate = useNavigate()
    useEffect(() => {
        navigate('/blog/editor')
    }, [])
}


export default Index