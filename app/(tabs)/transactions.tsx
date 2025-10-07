
import React, { useState } from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Pressable,
  Alert
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, commonStyles } from "@/styles/commonStyles";

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'buy' | 'sell' | 'swap';
  crypto: string;
  amount: number;
  value: number;
  date: string;
  time: string;
  status: 'completed' | 'pending' | 'failed';
  fee?: number;
  fromAddress?: string;
  toAddress?: string;
  hash?: string;
}

export default function TransactionsScreen() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'send' | 'receive' | 'buy' | 'sell'>('all');
  
  const [transactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'receive',
      crypto: 'BTC',
      amount: 0.0234,
      value: 1234.56,
      date: '2024-01-15',
      time: '14:30',
      status: 'completed',
      fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      hash: '0x1234567890abcdef'
    },
    {
      id: '2',
      type: 'send',
      crypto: 'ETH',
      amount: 0.5,
      value: 1876.32,
      date: '2024-01-14',
      time: '09:15',
      status: 'completed',
      fee: 0.002,
      toAddress: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      hash: '0xabcdef1234567890'
    },
    {
      id: '3',
      type: 'buy',
      crypto: 'ADA',
      amount: 500.0,
      value: 182.45,
      date: '2024-01-13',
      time: '16:45',
      status: 'pending'
    },
    {
      id: '4',
      type: 'sell',
      crypto: 'BTC',
      amount: 0.1,
      value: 4321.00,
      date: '2024-01-12',
      time: '11:20',
      status: 'completed',
      fee: 0.0001
    },
    {
      id: '5',
      type: 'swap',
      crypto: 'ETH',
      amount: 1.0,
      value: 3752.64,
      date: '2024-01-11',
      time: '13:10',
      status: 'failed'
    },
    {
      id: '6',
      type: 'receive',
      crypto: 'ADA',
      amount: 750.0,
      value: 273.68,
      date: '2024-01-10',
      time: '08:30',
      status: 'completed',
      fromAddress: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a'
    },
  ]);

  const filteredTransactions = selectedFilter === 'all' 
    ? transactions 
    : transactions.filter(tx => tx.type === selectedFilter);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send': return 'arrow.up.circle.fill';
      case 'receive': return 'arrow.down.circle.fill';
      case 'buy': return 'plus.circle.fill';
      case 'sell': return 'minus.circle.fill';
      case 'swap': return 'arrow.triangle.swap';
      default: return 'circle.fill';
    }
  };

  const getTransactionColor = (type: string, status: string) => {
    if (status === 'failed') return colors.error;
    if (status === 'pending') return colors.warning;
    
    switch (type) {
      case 'send': return colors.error;
      case 'receive': return colors.success;
      case 'buy': return colors.primary;
      case 'sell': return colors.warning;
      case 'swap': return colors.secondary;
      default: return colors.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const renderFilterButton = (filter: typeof selectedFilter, label: string) => (
    <Pressable
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterButtonText,
        selectedFilter === filter && styles.filterButtonTextActive
      ]}>
        {label}
      </Text>
    </Pressable>
  );

  const renderTransaction = (transaction: Transaction) => (
    <Pressable 
      key={transaction.id}
      style={[styles.transactionCard, commonStyles.card]}
      onPress={() => Alert.alert(
        'Transaction Details',
        `ID: ${transaction.id}\nHash: ${transaction.hash || 'N/A'}\nFee: ${transaction.fee || 'N/A'}`
      )}
    >
      <View style={styles.transactionHeader}>
        <View style={styles.transactionLeft}>
          <IconSymbol 
            name={getTransactionIcon(transaction.type) as any} 
            size={32} 
            color={getTransactionColor(transaction.type, transaction.status)} 
          />
          <View style={styles.transactionDetails}>
            <Text style={[commonStyles.text, { fontWeight: '600' }]}>
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} {transaction.crypto}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {transaction.date} at {transaction.time}
            </Text>
            <View style={styles.statusContainer}>
              <View style={[
                styles.statusDot, 
                { backgroundColor: getStatusColor(transaction.status) }
              ]} />
              <Text style={[
                commonStyles.textSecondary,
                { color: getStatusColor(transaction.status), fontSize: 12 }
              ]}>
                {transaction.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[
            commonStyles.text, 
            { 
              fontWeight: '600',
              color: getTransactionColor(transaction.type, transaction.status)
            }
          ]}>
            {transaction.type === 'send' || transaction.type === 'sell' ? '-' : '+'}
            {transaction.amount} {transaction.crypto}
          </Text>
          <Text style={commonStyles.textSecondary}>
            ${transaction.value.toFixed(2)}
          </Text>
          {transaction.fee && (
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              Fee: {transaction.fee} {transaction.crypto}
            </Text>
          )}
        </View>
      </View>
      
      {(transaction.fromAddress || transaction.toAddress) && (
        <View style={styles.addressContainer}>
          {transaction.fromAddress && (
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              From: {transaction.fromAddress.substring(0, 20)}...
            </Text>
          )}
          {transaction.toAddress && (
            <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
              To: {transaction.toAddress.substring(0, 20)}...
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        <View style={commonStyles.content}>
          <Text style={[commonStyles.title, { marginBottom: 24 }]}>
            Transaction History
          </Text>

          {/* Filter Buttons */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
            contentContainerStyle={styles.filterContent}
          >
            {renderFilterButton('all', 'All')}
            {renderFilterButton('send', 'Send')}
            {renderFilterButton('receive', 'Receive')}
            {renderFilterButton('buy', 'Buy')}
            {renderFilterButton('sell', 'Sell')}
          </ScrollView>

          {/* Transactions List */}
          <ScrollView 
            style={styles.transactionsList}
            contentContainerStyle={styles.transactionsContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(renderTransaction)
            ) : (
              <View style={[commonStyles.center, { marginTop: 40 }]}>
                <IconSymbol 
                  name="doc.text" 
                  size={48} 
                  color={colors.textSecondary} 
                />
                <Text style={[commonStyles.textSecondary, { marginTop: 16 }]}>
                  No transactions found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filterContainer: {
    marginBottom: 24,
  },
  filterContent: {
    paddingRight: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  filterButtonTextActive: {
    color: 'white',
  },
  transactionsList: {
    flex: 1,
  },
  transactionsContent: {
    paddingBottom: 100,
  },
  transactionCard: {
    marginBottom: 12,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  transactionDetails: {
    gap: 4,
    flex: 1,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  addressContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
});
