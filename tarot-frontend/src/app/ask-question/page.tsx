'use client';

import FooterText from "@/components/FooterText";
import OnProcessNavBar from "@/components/OnProcessNavBar";
import QuestionTextField from "@/components/QuestionTextField";
import { BackGround } from "@/styles/BackGround.styled";
import { DefaultMenuWrapContainer, HeaderText } from "@/styles/Shared.styled";


export default function AskQuestionPage() {

  return (
    <BackGround style={{height:'100vh'}}>
        <OnProcessNavBar/>
        <DefaultMenuWrapContainer>
            <QuestionTextField/>
        </DefaultMenuWrapContainer>
        <FooterText/>
    </BackGround>
  );
}
