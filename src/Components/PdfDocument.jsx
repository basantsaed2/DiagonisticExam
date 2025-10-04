// components/PdfDocument.jsx
import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  Image,
  StyleSheet,
  Link
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 35,
    fontFamily: 'Helvetica',
  },
  
  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottom: '3pt solid #cf202f',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 15,
    objectFit:'contain'
  },
  headerInfo: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#cf202f',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  examTitle: {
    fontSize: 14,
    color: '#374151',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  courseInfo: {
    fontSize: 11,
    color: '#6B7280',
  },
  studentCard: {
    backgroundColor: '#f7c6c5',
    padding: 12,
    borderRadius: 8,
    minWidth: 150,
  },
  studentLabel: {
    fontSize: 9,
    color: '#6B7280',
    marginBottom: 3,
  },
  studentValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#cf202f',
  },

  // Score Section Styles
  scoreSection: {
    backgroundColor: '#f7c6c5',
    borderRadius: 12,
    padding: 25,
    marginBottom: 25,
    border: '2pt solid #cf202f',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottom: '2pt solid #cf202f',
  },
  sectionIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#cf202f',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 16,
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreCircleWrapper: {
    alignItems: 'center',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    border: '10pt solid #cf202f',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  scorePercentage: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#cf202f',
  },
  scoreSubtext: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 5,
  },
  metricsContainer: {
    flex: 1,
    marginLeft: 25,
  },
  metricCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    border: '1pt solid #E5E7EB',
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    flex: 1,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Details Grid
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    gap: 10,
  },
  detailCard: {
    flex: 1,
    backgroundColor: '#f7c6c5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    border: '1pt solid #cf202f',
  },
  detailIcon: {
    fontSize: 20,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 5,
    textAlign: 'center',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
  },

  // Mistakes Section
  mistakesSection: {
    marginBottom: 25,
  },
  mistakeCard: {
    backgroundColor: '#f7c6c5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    border: '2pt solid #cf202f',
  },
  mistakeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1pt solid #cf202f',
  },
  questionBadge: {
    backgroundColor: '#cf202f',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  questionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  chapterText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: 'bold',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  imageLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  questionImage: {
    width: '100%',
    maxHeight: 180,
    objectFit: 'contain',
    borderRadius: 8,
    border: '2pt solid white',
    backgroundColor: 'white',
  },
  imageLink: {
    fontSize: 9,
    color: '#cf202f',
    textAlign: 'center',
    marginTop: 8,
    textDecoration: 'underline',
  },
  imageUrlFallback: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  urlText: {
    fontSize: 8,
    color: '#374151',
    textAlign: 'center',
  },
  warningText: {
    fontSize: 8,
    color: '#cf202f',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 35,
    right: 35,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTop: '2pt solid #f7c6c5',
  },
  footerText: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  pageNumber: {
    fontSize: 9,
    color: '#cf202f',
    fontWeight: 'bold',
  },
});

const PdfDocument = ({ data, user, mainLogo }) => {
  const { category, course, dai_exam, date, delay, mistakes = [] } = data;

  // Calculate metrics
  const totalQuestions = mistakes.length;
  const maxScore = 800;
  const score = data.score || 0;
  const scorePercentage = (score / maxScore) * 100;
  const correctAnswers = data.right_question || 0;
  const wrongAnswers = totalQuestions - correctAnswers;
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  const isPassed = score >= (data.pass_score || 400);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Enhanced Header */}
        <View style={styles.header}>
          <View style={styles.logoSection}>
            <Image src={mainLogo} style={styles.logo} />
            <View style={styles.headerInfo}>
              <Text style={styles.mainTitle}>Exam Results Report</Text>
              <Text style={styles.examTitle}>{dai_exam}</Text>
              <Text style={styles.courseInfo}>{category} • {course}</Text>
            </View>
          </View>
          <View style={styles.studentCard}>
            <Text style={styles.studentLabel}>Student Name</Text>
            <Text style={styles.studentValue}>{user || 'Student'}</Text>
            <Text style={styles.studentLabel}>Grade Level</Text>
            <Text style={styles.studentValue}>{data?.grade || 'N/A'}</Text>
            <Text style={styles.studentLabel}>Exam Date</Text>
            <Text style={styles.studentValue}>{date}</Text>
          </View>
        </View>

        {/* Enhanced Score Section */}
        {/* <View style={styles.scoreSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Performance Overview</Text>
          </View>

          <View style={styles.scoreContainer}>
            <View style={styles.scoreCircleWrapper}>
              <View style={styles.scoreCircle}>
                <Text style={styles.scorePercentage}>{Math.round(scorePercentage)}%</Text>
              </View>
              <Text style={styles.scoreSubtext}>Overall Score</Text>
            </View>

            <View style={styles.metricsContainer}>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{score.toFixed(2)}/{maxScore}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{Math.round(accuracy)}%</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{correctAnswers}/{totalQuestions}</Text>
              </View>
              <View style={styles.metricCard}>
                <Text style={styles.metricValue}>{wrongAnswers}/{totalQuestions}</Text>
              </View>
              <View style={[styles.metricCard, { backgroundColor: isPassed ? '#DCFCE7' : '#FEE2E2' }]}>
                <Text style={[
                  styles.statusBadge,
                  { backgroundColor: isPassed ? '#059669' : '#cf202f', color: 'white' }
                ]}>
                  {isPassed ? 'PASSED ✓' : 'NOT PASSED'}
                </Text>
              </View>
            </View>
          </View>
        </View> */}

        {/* Enhanced Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Category</Text>
            <Text style={styles.detailValue}>{category}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Course</Text>
            <Text style={styles.detailValue}>{course}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Delay</Text>
            <Text style={styles.detailValue}>{delay}</Text>
          </View>
          <View style={styles.detailCard}>
            <Text style={styles.detailLabel}>Total Questions</Text>
            <Text style={styles.detailValue}>{totalQuestions}</Text>
          </View>
        </View>

        {/* Enhanced Mistakes Section */}
        <View style={styles.mistakesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              Detailed Mistakes Analysis ({mistakes.length} Questions)
            </Text>
          </View>

          {mistakes.map((mistake, index) => (
            <View key={index} style={styles.mistakeCard} wrap={false}>
              <View style={styles.mistakeHeader}>
                <View style={styles.questionBadge}>
                  <Text style={styles.questionText}>Question {index + 1}</Text>
                </View>
                <Text style={styles.chapterText}>{mistake.chapter}</Text>
              </View>
              
              {mistake.questions && (
                <View style={styles.imageContainer}>
                  {mistake.questions.startsWith('data:') ? (
                    <>
                      <Image src={mistake.questions} style={styles.questionImage} />
                      {/* <Text style={styles.imageLabel}>✓ Image successfully embedded</Text> */}
                    </>
                  ) : (
                    <View style={styles.imageUrlFallback}>
                      <Text style={styles.urlText}>Image URL: {mistake.questions}</Text>
                      <Text style={styles.warningText}>
                        ⚠ Image could not be embedded due to server restrictions
                      </Text>
                      <Link src={mistake.questions}>
                        <Text style={styles.imageLink}>Click to view image online →</Text>
                      </Link>
                    </View>
                  )}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Enhanced Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
             Generated on {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })} • Diagnostic Exam Results Report
          </Text>
          <Text 
            style={styles.pageNumber} 
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} 
            fixed 
          />
        </View>
      </Page>
    </Document>
  );
};

export default PdfDocument;