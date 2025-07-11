'use client';

import FooterText from "@/components/FooterText";
import MainNavBar from "@/components/MainNavBar";
import QuestionTextField from "@/components/QuestionTextField";
import { BackGround } from "@/styles/BackGround.styled";
import { DefaultMenuWrapContainer, HeaderText } from "@/styles/Shared.styled";


export default function AskQuestionPage() {

  return (
    <BackGround style={{height:'100vh'}}>
        <MainNavBar/>
        <DefaultMenuWrapContainer>
            <QuestionTextField/>
        </DefaultMenuWrapContainer>
        <FooterText/>
    </BackGround>
  );
}
