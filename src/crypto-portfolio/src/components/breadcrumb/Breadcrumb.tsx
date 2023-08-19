import { ChevronRightIcon } from "@chakra-ui/icons";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import Card from 'components/card/Card';

type LinkObj = {
  href: string;
  name: string;
}

interface Props {
  links: LinkObj[],
  additional: {
    [x: string]: string
  }
}

const BreadCrumpStrip = (props: Props) => {

  const { links, additional } = props;

  return(
    <Card {...additional} py="2" px="6">
      <Breadcrumb spacing='8px' separator={<ChevronRightIcon color='gray.500' />}>
        {links.map(link => {
          return(
            <BreadcrumbItem>
              <BreadcrumbLink fontSize={"md"} fontWeight={"500"} href={link.href}>{link.name}</BreadcrumbLink>
            </BreadcrumbItem>
          )
        })}
      </Breadcrumb>
    </Card>
  );
};

export default BreadCrumpStrip;