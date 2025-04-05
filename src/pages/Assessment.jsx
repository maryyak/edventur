import React from 'react';
import {useParams} from "react-router-dom";
import {assessments} from "../utils/mock";
import {Flex, Typography} from "antd";

const Assessment = () => {
    const {id} = useParams();
    const assessment = assessments.find((a) => a.id === Number(id));

    return (
        <Flex vertical gap={30}>
            <Typography.Title>{assessment.title}</Typography.Title>
        </Flex>
    );
};

export default Assessment;