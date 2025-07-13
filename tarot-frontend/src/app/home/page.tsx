'use client';

import FooterText from '@/components/FooterText';
import HomeNavBar from '@/components/HomeNavBar';
import { useTarot } from '@/contexts/TarotContext.context';
import { BackGround } from '@/styles/BackGround.styled';
import { AllModeCardContainer, FlipContainer, FlipFace, FlipInner, ModeCardContainer, ModeImage, ModeTextInCard } from '@/styles/HomePageContainer.styled';
import { DefaultMenuWrapContainer, HeaderText } from '@/styles/Shared.styled';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SelectModePage() {
    const router = useRouter();

    const { updateMode, updateNumCard, clearAllState } = useTarot();

    const [isFlippedMode1, setIsFlippedMode1] = useState(false);
    const [isFlippedMode2, setIsFlippedMode2] = useState(false);
    const [isFlippedMode3, setIsFlippedMode3] = useState(false);

    useEffect(()=>{
        clearAllState();
    },[])

    const handleOnClickDaily = ()=>{
        updateMode('daily_life')
        updateNumCard(3);
        router.push('/pick-card');
    }

    const handleOnClickYesNo = ()=>{
        updateMode('yes_no')
        updateNumCard(1);
        router.push('/ask-question');
    }

    const handleOnClickChatAi = ()=>{
        updateMode('chat_ai')
        router.push('/ask-question');
    }
    return (
        <BackGround>
            <HomeNavBar/>
            <DefaultMenuWrapContainer>
                <HeaderText style={{marginBottom:'36px'}}>🔮 Tarot 🔮</HeaderText>
                <AllModeCardContainer>
                    <ModeCardContainer
                    onMouseEnter={() => setIsFlippedMode1(true)}
                    onMouseLeave={() => setIsFlippedMode1(false)}
                    onClick={handleOnClickDaily}
                    >
                        <ModeTextInCard>Daily Life</ModeTextInCard>
                        <FlipContainer>
                            <FlipInner flipped={isFlippedMode1}>
                            <FlipFace>
                                <ModeImage src='/assets/back.png' alt="Back" fill style={{ objectFit: 'cover' }} />
                            </FlipFace>
                            <FlipFace style={{ transform: 'rotateY(180deg) rotateZ(10deg)' }}>
                                <ModeImage src='/assets/mode/DailyLife.png' alt="Daily Life" fill style={{ objectFit: 'cover' }} />
                            </FlipFace>
                            </FlipInner>
                        </FlipContainer>
                    </ModeCardContainer>
                    <ModeCardContainer
                    onMouseEnter={() => setIsFlippedMode2(true)}
                    onMouseLeave={() => setIsFlippedMode2(false)}
                    onClick={handleOnClickYesNo}>
                        <ModeTextInCard>Yes / No</ModeTextInCard>
                        <FlipContainer>
                            <FlipInner flipped={isFlippedMode2}>
                            <FlipFace>
                                <ModeImage src='/assets/back.png' alt="Back" fill style={{ objectFit: 'cover' }} />
                            </FlipFace>
                            <FlipFace style={{ transform: 'rotateY(180deg) rotateZ(10deg)' }}>
                                <ModeImage src='/assets/mode/Yes-No.png' alt="yes-no" fill style={{ objectFit: 'cover' }} />
                            </FlipFace>
                            </FlipInner>
                        </FlipContainer>
                    </ModeCardContainer>
                    <ModeCardContainer
                    onMouseEnter={() => setIsFlippedMode3(true)}
                    onMouseLeave={() => setIsFlippedMode3(false)}
                    onClick={handleOnClickChatAi}>
                        <ModeTextInCard>Chat AI</ModeTextInCard>
                        <FlipContainer>
                            <FlipInner flipped={isFlippedMode3}>
                            <FlipFace>
                                <ModeImage src='/assets/back.png' alt="Back" fill style={{ objectFit: 'cover' }} />
                            </FlipFace>
                            <FlipFace style={{ transform: 'rotateY(180deg) rotateZ(10deg)' }}>
                                <ModeImage src='/assets/mode/ChatAi.png' alt="ChatAi" fill style={{ objectFit: 'cover' }} />
                            </FlipFace>
                            </FlipInner>
                        </FlipContainer>
                    </ModeCardContainer>
                </AllModeCardContainer>
            </DefaultMenuWrapContainer>
            <FooterText/>
        </BackGround>
    );
}
