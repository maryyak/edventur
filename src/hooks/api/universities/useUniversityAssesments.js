import {useState, useEffect} from 'react';

const API_URL = process.env.REACT_APP_API_URL;


const useUniversityAssessments = (universityId) => {
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    const fetchAssessments = async () => {
        try {
            const response = await fetch(`${API_URL}/universities/${universityId}/assessments`);
            if (!response.ok) {
                throw new Error('Ошибка при загрузке программ');
            }
            const data = await response.json();
            setAssessments(data);
            setLoading(false);
        } catch (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    return {assessments, loading, error, mutate: fetchAssessments};
};

export default useUniversityAssessments;
