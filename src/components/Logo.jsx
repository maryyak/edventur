import React from 'react';
import {Flex, Typography} from "antd";

const Logo = () => {
    return (
        <Flex align="center" style={{padding:'0 16px'}}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 8V18" stroke="#78258D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path
                    d="M6.7749 26.9999C7.77548 25.4653 9.14312 24.2045 10.7539 23.3317C12.3648 22.459 14.1679 22.002 15.9999 22.002C17.8319 22.002 19.635 22.459 21.2459 23.3317C22.8567 24.2045 24.2243 25.4653 25.2249 26.9999"
                    stroke="#78258D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M28 8L16 12L4 8L16 4L28 8Z" stroke="#78258D" strokeWidth="2" strokeLinecap="round"
                      strokeLinejoin="round"/>
                <path
                    d="M21.1625 10.2754C22.0798 11.2771 22.6859 12.5241 22.9068 13.8643C23.1277 15.2044 22.954 16.58 22.4067 17.8231C21.8595 19.0663 20.9624 20.1233 19.8248 20.8655C18.6872 21.6077 17.3583 22.0028 16 22.0028C14.6417 22.0028 13.3128 21.6077 12.1752 20.8655C11.0376 20.1233 10.1405 19.0663 9.59329 17.8231C9.04604 16.58 8.87229 15.2044 9.09322 13.8643C9.31414 12.5241 9.9202 11.2771 10.8375 10.2754"
                    stroke="#78258D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <Typography.Text strong style={{color: "#78258D"}}>Edventur</Typography.Text>
        </Flex>
    );
};

export default Logo;