import { CenterComponent, HeadingComponent } from '../../../util/Ui';
import {
  Container,
  Heading,
  Icon,
  Text,
  VStack,
  Wrap,
  useColorModeValue,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import { BsBox, BsShieldCheck } from 'react-icons/bs';
import { GiCubes, GiWineGlass } from 'react-icons/gi';
import { PageWrapper } from '../../../util/PageWrapper';

const TagComponent = ({
  icon,
  heading,
}: {
  icon: IconType;
  heading: string;
}) => {
  return (
    <CenterComponent
      style={{
        minW: 200,
      }}
    >
      <VStack w="full">
        <Icon as={icon} boxSize={14}></Icon>
        <Heading size="sm">{heading}</Heading>
      </VStack>
    </CenterComponent>
  );
};

export const PowerOfBlockchainComponent = () => {
  return (
    <PageWrapper>
      <HeadingComponent
        heading="Build with the power of"
        gradientHeading="BLOCKCHAIN"
      ></HeadingComponent>
      <Icon
        as={GiCubes}
        boxSize={[270, 300]}
        opacity={useColorModeValue(0.75, 1)}
      ></Icon>
      <Container>
        <Text textAlign="center">
          Every logic & reward distribution written on secure smart contracts.
          All smart contracts are verified on block explorers & open source.
        </Text>
      </Container>
      <Wrap spacing={10} align="center" justify="center">
        <TagComponent icon={GiWineGlass} heading="Transparent"></TagComponent>
        <TagComponent icon={BsShieldCheck} heading="Secured"></TagComponent>
        <TagComponent icon={BsBox} heading="Open Source"></TagComponent>
        {/* <TagComponent icon={FaLock} heading="Renounced"></TagComponent> */}
      </Wrap>
    </PageWrapper>
  );
};
