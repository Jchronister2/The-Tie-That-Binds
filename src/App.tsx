import { useEffect, useState } from 'react'

import { Box, Button, Container, Flex, Heading, List, ListItem, Spinner, Text, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'

const fileList = [
  'No_Name_Newsletter_Vol_1_Issue_2_1986_12_30.pdf',
  'The_Tie_That_Binds_Vol_2_Issue_1_1987_July.pdf',
  'The_Tie_That_Binds_Vol_2_Issue_1_1988_February.pdf',
  'The_Tie_That_Binds_Vol_2_Issue_2_1988_September.pdf',
  'The_Tie_That_Binds_Vol_3_Issue_1_1989_March.pdf',
  'The_Tie_That_Binds_Vol_3_Issue_2_1989_October.pdf',
  'The_Tie_That_Binds_Vol_4_Issue_1_1990_May.pdf',
  'The_Tie_That_Binds_Vol_4_Issue_2_1990_November.pdf',
  'The_Tie_That_Binds_Vol_5_Issue_1_1991_May.pdf',
  'The_Tie_That_Binds_Vol_5_Issue_2_1991_November.pdf',
  'The_Tie_That_Binds_Vol_6_Issue_1_1992_May.pdf',
  'The_Tie_That_Binds_Vol_6_Issue_2_1992_November.pdf',
  'The_Tie_That_Binds_Vol_8_Issue_1_1994_February.pdf',
  'The_Tie_That_Binds_Vol_8_Issue_2_1994_November.pdf',
  'The_Tie_That_Binds_Vol_9_Issue_1_1995_August.pdf',
  'The_Tie_That_Binds_Special_Edition_1996_February.pdf',
  'The_Tie_That_Binds_Vol_11_Issue_1_1996_June.pdf',
  'The_Tie_That_Binds_Vol_12_Issue_2_1996_December.pdf',
  'The_Tie_That_Binds_Special_Edition_2010_March.pdf',
  'Walter_Harvey_Titus_Interview_1975.pdf'
]

const getDate = (filename: string) => {
  const parts = filename.replace('.pdf', '').split('_')

  if (filename.includes('Walter_Harvey_Titus_Interview')) {
    return new Date('1975-01-01')
  }

  if (filename.includes('No_Name_Newsletter')) {
    const year = parseInt(parts[parts.length - 3])
    const month = parseInt(parts[parts.length - 2])
    const day = parseInt(parts[parts.length - 1])
    return new Date(year, month - 1, day)
  }

  const year = parseInt(parts[parts.length - 2])
  const month = parts[parts.length - 1]
  return new Date(`${month} 1, ${year}`)
}

const sortedFiles = [...fileList].sort((a, b) => {
  return getDate(a).getTime() - getDate(b).getTime()
})

function App() {
  const isMobile = useBreakpointValue({ base: true, lg: false })
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullScreen, setIsFullScreen] = useState(false)

  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const itemBg = useColorModeValue('white', 'gray.800')
  const itemHoverBg = useColorModeValue('blue.50', 'blue.900')
  const activeBg = useColorModeValue('blue.500', 'blue.600')

  useEffect(() => {
    if (isMobile === false && !selectedFile) {
      setSelectedFile(sortedFiles[0])
    }
  }, [isMobile, selectedFile])

  useEffect(() => {
    setIsLoading(true)
  }, [selectedFile])

  const handleFileSelect = (file: string) => {
    setSelectedFile(file)
  }

  const formatFileName = (filename: string) => {
    return filename.replace(/_/g, ' ').replace('.pdf', '')
  }

  if (isMobile && selectedFile) {
    return (
      <Box h="100vh" bg="gray.900" display="flex" flexDirection="column">
        <Flex p={2} bg="blue.600" align="center" justify="space-between" boxShadow="md">
          <Button
            size="sm"
            onClick={() => setSelectedFile(null)}
            variant="outline"
            color="white"
            borderColor="white"
            _hover={{ bg: 'whiteAlpha.200' }}
            _active={{ bg: 'whiteAlpha.300' }}
          >
            Back
          </Button>
          <Text color="white" fontWeight="bold" noOfLines={1} ml={4} flex={1} textAlign="right">
            {formatFileName(selectedFile)}
          </Text>
        </Flex>
        <Box flex={1} position="relative">
          {isLoading && (
            <Flex position="absolute" inset={0} justify="center" align="center" bg="white" zIndex={1}>
              <Spinner size="lg" color="blue.500" />
              <Text ml={4}>Loading PDF...</Text>
            </Flex>
          )}
          <Box
            as="iframe"
            src={`${import.meta.env.BASE_URL}articles/${selectedFile}`}
            width="100%"
            height="100%"
            bg="white"
            onLoad={() => setIsLoading(false)}
          />
        </Box>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="1200px">
        <Heading as="h1" size="xl" color="blue.500" textAlign="center" mb={8}>
          The Tie That Binds - Archive
        </Heading>

        <Flex
          direction={{ base: 'column', lg: 'row' }}
          gap={4}
          mb={8}
        >
          <Box
            flex={{ base: '1', lg: '0 0 33.333%' }}
            maxH={{ base: '60vh', lg: '75vh' }}
            overflowY="auto"
            borderWidth={1}
            borderRadius="md"
            bg={itemBg}
            p={2}
          >
            <List spacing={1}>
              {sortedFiles.map((file) => (
                <ListItem
                  key={file}
                  p={2}
                  borderRadius="md"
                  cursor="pointer"
                  bg={selectedFile === file ? activeBg : 'transparent'}
                  color={selectedFile === file ? 'white' : 'inherit'}
                  _hover={{
                    bg: selectedFile === file ? activeBg : itemHoverBg
                  }}
                  onClick={() => handleFileSelect(file)}
                >
                  {formatFileName(file)}
                </ListItem>
              ))}
            </List>
          </Box>

          {!isMobile && (
            <Box
              flex={isFullScreen ? undefined : { base: '1', lg: '0 0 66.666%' }}
              position={isFullScreen ? 'fixed' : 'relative'}
              inset={isFullScreen ? 0 : undefined}
              zIndex={isFullScreen ? 2000 : undefined}
              bg={isFullScreen ? 'gray.900' : undefined}
              h={isFullScreen ? '100vh' : undefined}
              display={isFullScreen ? 'flex' : 'block'}
              flexDirection={isFullScreen ? 'column' : undefined}
            >
              {isFullScreen && (
                <Flex p={2} bg="blue.600" align="center" justify="space-between" boxShadow="md">
                  <Button
                    size="sm"
                    onClick={() => setIsFullScreen(false)}
                    variant="outline"
                    color="white"
                    borderColor="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    _active={{ bg: 'whiteAlpha.300' }}
                  >
                    Exit Full Screen
                  </Button>
                  <Text color="white" fontWeight="bold" noOfLines={1} ml={4} flex={1} textAlign="right">
                    {selectedFile ? formatFileName(selectedFile) : ''}
                  </Text>
                </Flex>
              )}

              {!isFullScreen && selectedFile && (
                <Flex justify="flex-end" mb={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => setIsFullScreen(true)}
                  >
                    Full Screen
                  </Button>
                </Flex>
              )}

              {isLoading && (
                <Flex justify="center" align="center" mb={4} h={isFullScreen ? '100%' : undefined}>
                  <Spinner size="lg" color="blue.500" />
                  <Text ml={4}>Loading PDF...</Text>
                </Flex>
              )}
              {selectedFile && (
                <Box
                  as="iframe"
                  src={`${import.meta.env.BASE_URL}articles/${selectedFile}`}
                  width="100%"
                  height={isFullScreen ? '100%' : { base: '60vh', lg: '75vh' }}
                  borderWidth={isFullScreen ? 0 : 2}
                  borderColor="blue.500"
                  borderRadius={isFullScreen ? 0 : 'md'}
                  bg="white"
                  onLoad={() => setIsLoading(false)}
                />
              )}
            </Box>
          )}
        </Flex>

        <Box textAlign="center" mt={8}>
          <Heading as="h4" size="md" mb={2}>
            Support This Archive
          </Heading>
          <Text mb={4}>
            This archive makes our shared history available to everyone. If you'd like to help keep the page up, please contribute!
          </Text>
          <Box
            as="form"
            action="https://www.paypal.com/donate"
            method="post"
            target="_top"
            display="inline-block"
          >
            <input type="hidden" name="business" value="Q2BDTQ9YF6QK6" />
            <input type="hidden" name="no_recurring" value="0" />
            <input
              type="hidden"
              name="item_name"
              value="This archive makes our shared history available to everyone. If you'd like to help keep the page up, please contribute!"
            />
            <input type="hidden" name="currency_code" value="USD" />
            <Box
              as="input"
              type="image"
              src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif"
              border="0"
              name="submit"
              title="PayPal - The safer, easier way to pay online!"
              alt="Donate with PayPal button"
              cursor="pointer"
            />
            <Box
              as="img"
              alt=""
              border="0"
              src="https://www.paypal.com/en_US/i/scr/pixel.gif"
              width="1"
              height="1"
            />
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default App

