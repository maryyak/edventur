import React from 'react';
import {Alert, Button, Flex, Typography} from "antd";
import {Link, useParams} from "react-router-dom";
import {programs, userInfo} from "../utils/mock";

const Request = () => {
    const {id} = useParams();
    const program = programs.find((p) => p.id === Number(id));
    const needAssessment = program.assessment && !userInfo.assessments.includes(program.assessment);

    return (
        <Flex vertical gap={30}>
            <Typography.Title>{program.title}</Typography.Title>
            {needAssessment ?
                <Alert message="Информация"
                       description="Для подачи заявления на данную программу для начала пройдите ассесмент"
                       type="info" showIcon
                       action={
                           <Button>
                               <Link to={`/assessment/${program.assessment}`}>Пройти</Link>
                           </Button>
                       }
                />
                :
                <></>
            }
        </Flex>
    );
};

export default Request;