
// components/ReportDocument.jsx
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet,
  Image,
  Font
} from '@react-pdf/renderer';

// Register fonts for better typography
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/roboto/v30/KFOlCnqEu92Fr1MmEU9fBBc9.ttf', fontWeight: 700 },
  ],
});

// Enhanced styles for ReportDocument
const reportStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#F8FAFC',
    padding: 40,
    fontFamily: 'Roboto',
    fontSize: 11,
    color: '#1E293B',
  },
  header: {
    flexDirection: 'column',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 15,
    borderBottom: '2pt solid #B91C1C',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: '30%',
    height: '30%',
    objectFit:'contain',
    marginRight: 5,
  },
  // headerText: {
  //   flex: 1,
  // },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#B91C1C',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: 400,
  },
  studentInfo: {
    fontSize: 10,
    color: '#1E293B',
    textAlign: 'left',
    lineHeight: 1.5,
  },
  section: {
    marginBottom: 25,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 20,
    border: '1pt solid #E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottom: '1pt solid #FECACA',
  },
  sectionIcon: {
    width: 28,
    height: 28,
    backgroundColor: '#B91C1C',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1E293B',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
  },
  statCard: {
    alignItems: 'center',
    padding: 15,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 700,
    color: '#B91C1C',
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 10,
    color: '#64748B',
    textAlign: 'center',
  },
  infoGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 14,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: 700,
    color: '#1E293B',
  },
  chapterAnalysis: {
    marginBottom: 15,
  },
  chapterCard: {
    marginBottom: 10,
    padding: 15,
    border: '1pt solid #E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chapterName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#B91C1C',
  },
  mistakeCount: {
    fontSize: 10,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  questionsList: {
    fontSize: 10,
    color: '#64748B',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
    borderColor: '#E2E8F0',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: '#B91C1C',
    padding: 8,
  },
  tableCol: {
    width: '25%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#E2E8F0',
    padding: 8,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: 700,
    color: '#FFFFFF',
  },
  tableCell: {
    fontSize: 9,
    color: '#1E293B',
  },
  recommendationCard: {
    marginTop: 15,
    padding: 15,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    borderLeft: '4pt solid #B91C1C',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#1E293B',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 10,
    color: '#1E293B',
    lineHeight: 1.5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTop: '1pt solid #E2E8F0',
  },
  footerText: {
    fontSize: 9,
    color: '#94A3B8',
  },
  pageNumber: {
    fontSize: 9,
    color: '#94A3B8',
  },
});

const ReportDocument = ({ data, user, mainLogo,delayInfo }) => {
  const { course, dai_exam, grade, mistakes = [], report } = data;
  const { date, time, delay } = report || {};

    // Use delayInfo from props instead of report.delay
  const delayDisplay = delayInfo?.exceeded ? `+${delayInfo.delay}` : '0';

  // Calculate statistics
  const totalMistakes = mistakes.length;
  const mistakesByChapter = mistakes.reduce((acc, mistake) => {
    const chapter = mistake.chapter;
    if (!acc[chapter]) {
      acc[chapter] = [];
    }
    acc[chapter].push(mistake);
    return acc;
  }, {});
  const uniqueQuestions = [...new Set(mistakes.map(m => m.question_number))].length;

  // Improved grouping function that only creates groups when needed
  const groupChaptersByPage = (chapters) => {
    if (Object.keys(chapters).length === 0) return []; // No chapters = no groups
    
    const chaptersArray = Object.entries(chapters);
    
    // If we have very few chapters, they'll likely fit on the first page
    if (chaptersArray.length <= 3) {
      return [chaptersArray]; // Single group that goes on first page
    }
    
    // Only create multiple groups for many chapters
    const groups = [];
    let currentGroup = [];
    
    chaptersArray.forEach(([chapter, chapterMistakes]) => {
      currentGroup.push([chapter, chapterMistakes]);
      
      // Start new group after every 4-5 chapters (adjust based on your content size)
      if (currentGroup.length >= 4) {
        groups.push(currentGroup);
        currentGroup = [];
      }
    });
    
    // Add remaining chapters to last group
    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }
    
    return groups;
  };

  const chapterGroups = groupChaptersByPage(mistakesByChapter);

  // Check if we have any chapters to display
  const hasChapters = Object.keys(mistakesByChapter).length > 0;

  return (
    <Document>
      {/* First Page with Summary AND Chapters (if they fit) */}
      <Page size="A4" style={reportStyles.page}>
        {/* Header with Logo and Student Info */}
        <View style={reportStyles.header}>
          <View style={reportStyles.logoContainer}>
            <Image src={mainLogo} style={reportStyles.logo} />
            <View style={reportStyles.headerText}>
              <Text style={reportStyles.title}>Detailed Diagnostic Report</Text>
              <Text style={reportStyles.subtitle}>{dai_exam}</Text>
            </View>
          </View>
          <View style={reportStyles.studentInfo}>
            <Text>Student: {user || 'Student'}</Text>
            <Text>Grade: {grade || user?.grade || 'N/A'}</Text>
            <Text>Date: {date}</Text>
          </View>
        </View>

        {/* Report Summary Section */}
        <View style={reportStyles.section}>
          <View style={reportStyles.sectionHeader}>
            <Text style={reportStyles.sectionTitle}>Performance Summary</Text>
          </View>
          <View style={reportStyles.statsGrid}>
            <View style={reportStyles.statCard}>
              <Text style={reportStyles.statNumber}>{totalMistakes}</Text>
              <Text style={reportStyles.statLabel}>Total Mistakes</Text>
            </View>
            <View style={reportStyles.statCard}>
              <Text style={reportStyles.statNumber}>{Object.keys(mistakesByChapter).length}</Text>
              <Text style={reportStyles.statLabel}>Chapters with Issues</Text>
            </View>
            <View style={reportStyles.statCard}>
              <Text style={reportStyles.statNumber}>{uniqueQuestions}</Text>
              <Text style={reportStyles.statLabel}>Questions with Mistakes</Text>
            </View>
          </View>
          <View style={reportStyles.infoGrid}>
            <View style={reportStyles.infoCard}>
              <Text style={reportStyles.infoLabel}>Exam Date</Text>
              <Text style={reportStyles.infoValue}>{date}</Text>
            </View>
            <View style={reportStyles.infoCard}>
              <Text style={reportStyles.infoLabel}>Time Taken</Text>
              <Text style={reportStyles.infoValue}>{time}</Text>
            </View>
            <View style={reportStyles.infoCard}>
              <Text style={reportStyles.infoLabel}>Delay</Text>
              <Text style={reportStyles.infoValue}>{delayDisplay}</Text>
            </View>
            <View style={reportStyles.infoCard}>
              <Text style={reportStyles.infoLabel}>Course</Text>
              <Text style={reportStyles.infoValue}>{course}</Text>
            </View>
          </View>
        </View>

        {/* Render first group of chapters on the same page if we have few chapters */}
        {hasChapters && chapterGroups.length <= 1 && (
          <View style={reportStyles.section}>
            <View style={reportStyles.sectionHeader}>
              <Text style={reportStyles.sectionTitle}>Chapter-wise Analysis</Text>
            </View>
            <View style={reportStyles.chapterAnalysis}>
              {chapterGroups[0].map(([chapter, chapterMistakes]) => (
                <View key={chapter} style={reportStyles.chapterCard}>
                  <View style={reportStyles.chapterHeader}>
                    <Text style={reportStyles.chapterName}>{chapter}</Text>
                    <Text style={reportStyles.mistakeCount}>
                      {chapterMistakes.length} mistake{chapterMistakes.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <Text style={reportStyles.questionsList}>
                    Questions: {[...new Set(chapterMistakes.map(m => m.question_number))].join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>

      {/* Additional Pages for Chapter Analysis ONLY when we have multiple groups */}
      {chapterGroups.length > 1 && chapterGroups.map((chapterGroup, pageIndex) => (
        <Page key={pageIndex} size="A4" style={reportStyles.page}>
          {/* Page Header for continuation pages */}
          <View style={reportStyles.header}>
            <View style={reportStyles.logoContainer}>
              <Image src={mainLogo} style={reportStyles.logo} />
              <View style={reportStyles.headerText}>
                <Text style={reportStyles.title}>Chapter Analysis</Text>
                <Text style={reportStyles.subtitle}>
                  {dai_exam} - Page {pageIndex + 2}
                </Text>
              </View>
            </View>
          </View>

          {/* Chapter-wise Analysis for this page */}
          <View style={reportStyles.section}>
            <View style={reportStyles.sectionHeader}>
              <Text style={reportStyles.sectionTitle}>
                {pageIndex === 0 ? 'Chapter-wise Analysis' : 'Chapter-wise Analysis (Continued)'}
              </Text>
            </View>
            <View style={reportStyles.chapterAnalysis}>
              {chapterGroup.map(([chapter, chapterMistakes]) => (
                <View key={chapter} style={reportStyles.chapterCard}>
                  <View style={reportStyles.chapterHeader}>
                    <Text style={reportStyles.chapterName}>{chapter}</Text>
                    <Text style={reportStyles.mistakeCount}>
                      {chapterMistakes.length} mistake{chapterMistakes.length > 1 ? 's' : ''}
                    </Text>
                  </View>
                  <Text style={reportStyles.questionsList}>
                    Questions: {[...new Set(chapterMistakes.map(m => m.question_number))].join(', ')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default ReportDocument;