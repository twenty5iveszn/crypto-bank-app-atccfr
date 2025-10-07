
import React, { useState } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  Platform,
  Alert 
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { GlassView } from "expo-glass-effect";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";

interface CryptoBalance {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change24h: number;
  icon: string;
}

interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'buy' | 'sell';
  crypto: string;
  amount: number;
  value: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

export default function CryptoDashboard() {
  const theme = useTheme();
  
  // Mock data for crypto balances
  const [cryptoBalances] = useState<CryptoBalance[]>([
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.5432,
      value: 23456.78,
      change24h: 2.34,
      icon: 'bitcoinsign.circle.fill'
    },
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 3.2145,
      value: 8765.43,
      change24h: -1.23,
      icon: 'e.circle.fill'
    },
    {
      symbol: 'ADA',
      name: 'Cardano',
      balance: 1250.0,
      value: 456.78,
      change24h: 5.67,
      icon: 'a.circle.fill'
    },
  ]);

  // Mock data for recent transactions
  const [recentTransactions] = useState<Transaction[]>([
    {
      id: '1',
      type: 'receive',
      crypto: 'BTC',
      amount: 0.0234,
      value: 1234.56,
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'send',
      crypto: 'ETH',
      amount: 0.5,
      value: 1876.32,
      date: '2024-01-14',
      status: 'completed'
    },
    {
      id: '3',
      type: 'buy',
      crypto: 'ADA',
      amount: 500.0,
      value: 182.45,
      date: '2024-01-13',
      status: 'pending'
    },
  ]);

  const totalPortfolioValue = cryptoBalances.reduce((sum, crypto) => sum + crypto.value, 0);

  const renderCryptoCard = (crypto: CryptoBalance) => (
    <Pressable 
      key={crypto.symbol}
      style={[styles.cryptoCard, commonStyles.card]}
      onPress={() => Alert.alert(`${crypto.name}`, `View ${crypto.symbol} details`)}
    >
      <View style={styles.cryptoHeader}>
        <View style={styles.cryptoInfo}>
          <IconSymbol 
            name={crypto.icon as any} 
            size={32} 
            color={colors.primary} 
          />
          <View style={styles.cryptoDetails}>
            <Text style={[commonStyles.subtitle, { fontSize: 16 }]}>
              {crypto.symbol}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {crypto.name}
            </Text>
          </View>
        </View>
        <View style={styles.cryptoValues}>
          <Text style={[commonStyles.subtitle, { fontSize: 16 }]}>
            ${crypto.value.toLocaleString()}
          </Text>
          <Text style={[
            commonStyles.textSecondary,
            { color: crypto.change24h >= 0 ? colors.success : colors.error }
          ]}>
            {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
          </Text>
        </View>
      </View>
      <Text style={[commonStyles.textSecondary, { marginTop: 8 }]}>
        {crypto.balance.toFixed(4)} {crypto.symbol}
      </Text>
    </Pressable>
  );

  const renderTransaction = (transaction: Transaction) => {
    const getTransactionIcon = () => {
      switch (transaction.type) {
        case 'send': return 'arrow.up.circle.fill';
        case 'receive': return 'arrow.down.circle.fill';
        case 'buy': return 'plus.circle.fill';
        case 'sell': return 'minus.circle.fill';
        default: return 'circle.fill';
      }
    };

    const getTransactionColor = () => {
      switch (transaction.type) {
        case 'send': return colors.error;
        case 'receive': return colors.success;
        case 'buy': return colors.primary;
        case 'sell': return colors.warning;
        default: return colors.textSecondary;
      }
    };

    return (
      <Pressable 
        key={transaction.id}
        style={styles.transactionItem}
        onPress={() => Alert.alert('Transaction Details', `View transaction ${transaction.id}`)}
      >
        <View style={styles.transactionLeft}>
          <IconSymbol 
            name={getTransactionIcon() as any} 
            size={24} 
            color={getTransactionColor()} 
          />
          <View style={styles.transactionDetails}>
            <Text style={[commonStyles.text, { fontSize: 14, fontWeight: '600' }]}>
              {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} {transaction.crypto}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {transaction.date} • {transaction.status}
            </Text>
          </View>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[
            commonStyles.text, 
            { 
              fontSize: 14, 
              fontWeight: '600',
              color: transaction.type === 'send' ? colors.error : colors.success 
            }
          ]}>
            {transaction.type === 'send' ? '-' : '+'}{transaction.amount} {transaction.crypto}
          </Text>
          <Text style={commonStyles.textSecondary}>
            ${transaction.value.toFixed(2)}
          </Text>
        </View>
      </Pressable>
    );
  };

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert("Notifications", "View all notifications")}
      style={styles.headerButton}
    >
      <IconSymbol name="bell.fill" color={colors.primary} size={20} />
    </Pressable>
  );

  const renderHeaderLeft = () => (
    <Pressable
      onPress={() => Alert.alert("Settings", "Open settings menu")}
      style={styles.headerButton}
    >
      <IconSymbol name="gear" color={colors.primary} size={20} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Crypto Wallet",
            headerRight: renderHeaderRight,
            headerLeft: renderHeaderLeft,
          }}
        />
      )}
      <View style={[commonStyles.container, { backgroundColor: colors.background }]}>
        <ScrollView 
          style={commonStyles.content}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Portfolio Overview */}
          <View style={[styles.portfolioCard, commonStyles.card]}>
            <Text style={commonStyles.textSecondary}>Total Portfolio Value</Text>
            <Text style={[commonStyles.title, { fontSize: 32, marginBottom: 16 }]}>
              ${totalPortfolioValue.toLocaleString()}
            </Text>
            <View style={styles.actionButtons}>
              <Pressable 
                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                onPress={() => Alert.alert("Buy Crypto", "Feature coming soon")}
              >
                <IconSymbol name="plus" color="white" size={16} />
                <Text style={styles.actionButtonText}>Buy</Text>
              </Pressable>
              <Pressable 
                style={[styles.actionButton, { backgroundColor: colors.secondary }]}
                onPress={() => Alert.alert("Send Crypto", "Feature coming soon")}
              >
                <IconSymbol name="arrow.up" color="white" size={16} />
                <Text style={styles.actionButtonText}>Send</Text>
              </Pressable>
              <Pressable 
                style={[styles.actionButton, { backgroundColor: colors.accent }]}
                onPress={() => Alert.alert("Receive Crypto", "Feature coming soon")}
              >
                <IconSymbol name="arrow.down" color="white" size={16} />
                <Text style={styles.actionButtonText}>Receive</Text>
              </Pressable>
            </View>
          </View>

          {/* Crypto Holdings */}
          <View style={styles.section}>
            <Text style={[commonStyles.subtitle, { marginBottom: 12 }]}>
              Your Holdings
            </Text>
            {cryptoBalances.map(renderCryptoCard)}
          </View>

          {/* Recent Transactions */}
          <View style={styles.section}>
            <View style={[commonStyles.row, { marginBottom: 12 }]}>
              <Text style={commonStyles.subtitle}>Recent Transactions</Text>
              <Pressable onPress={() => Alert.alert("All Transactions", "View transaction history")}>
                <Text style={[commonStyles.textSecondary, { color: colors.primary }]}>
                  View All
                </Text>
              </Pressable>
            </View>
            <View style={[styles.transactionsCard, commonStyles.card]}>
              {recentTransactions.map(renderTransaction)}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 16,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100, // Extra padding for floating tab bar
  },
  portfolioCard: {
    alignItems: 'center',
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  cryptoCard: {
    marginBottom: 12,
  },
  cryptoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cryptoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cryptoDetails: {
    gap: 2,
  },
  cryptoValues: {
    alignItems: 'flex-end',
    gap: 2,
  },
  transactionsCard: {
    padding: 0,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  transactionDetails: {
    gap: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  headerButton: {
    padding: 8,
  },
});
