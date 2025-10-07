
import React, { useState } from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Pressable, 
  TextInput,
  Alert,
  Modal
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, commonStyles } from "@/styles/commonStyles";

interface Wallet {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  address: string;
  icon: string;
}

export default function WalletScreen() {
  const [wallets] = useState<Wallet[]>([
    {
      id: '1',
      name: 'Bitcoin Wallet',
      symbol: 'BTC',
      balance: 0.5432,
      address: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
      icon: 'bitcoinsign.circle.fill'
    },
    {
      id: '2',
      name: 'Ethereum Wallet',
      symbol: 'ETH',
      balance: 3.2145,
      address: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
      icon: 'e.circle.fill'
    },
    {
      id: '3',
      name: 'Cardano Wallet',
      symbol: 'ADA',
      balance: 1250.0,
      address: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2qd4a',
      icon: 'a.circle.fill'
    },
  ]);

  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [sendAmount, setSendAmount] = useState('');
  const [sendAddress, setSendAddress] = useState('');

  const renderWallet = (wallet: Wallet) => (
    <Pressable 
      key={wallet.id}
      style={[styles.walletCard, commonStyles.card]}
      onPress={() => setSelectedWallet(wallet)}
    >
      <View style={styles.walletHeader}>
        <View style={styles.walletInfo}>
          <IconSymbol 
            name={wallet.icon as any} 
            size={40} 
            color={colors.primary} 
          />
          <View style={styles.walletDetails}>
            <Text style={[commonStyles.subtitle, { fontSize: 18 }]}>
              {wallet.name}
            </Text>
            <Text style={commonStyles.textSecondary}>
              {wallet.balance.toFixed(4)} {wallet.symbol}
            </Text>
          </View>
        </View>
        <IconSymbol 
          name="chevron.right" 
          size={16} 
          color={colors.textSecondary} 
        />
      </View>
      <View style={styles.addressContainer}>
        <Text style={[commonStyles.textSecondary, { fontSize: 12 }]}>
          Address: {wallet.address.substring(0, 20)}...
        </Text>
      </View>
    </Pressable>
  );

  const handleSend = () => {
    if (!selectedWallet || !sendAmount || !sendAddress) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    Alert.alert(
      "Confirm Transaction",
      `Send ${sendAmount} ${selectedWallet.symbol} to ${sendAddress.substring(0, 20)}...?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Send", 
          onPress: () => {
            setShowSendModal(false);
            setSendAmount('');
            setSendAddress('');
            Alert.alert("Success", "Transaction sent successfully!");
          }
        }
      ]
    );
  };

  const copyAddress = (address: string) => {
    // In a real app, you would copy to clipboard
    Alert.alert("Copied", "Address copied to clipboard");
  };

  return (
    <SafeAreaView style={commonStyles.safeArea}>
      <View style={commonStyles.container}>
        <ScrollView 
          style={commonStyles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={[commonStyles.title, { marginBottom: 24 }]}>
            My Wallets
          </Text>

          {/* Wallets List */}
          <View style={styles.section}>
            {wallets.map(renderWallet)}
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
              Quick Actions
            </Text>
            <View style={styles.actionGrid}>
              <Pressable 
                style={[styles.quickAction, { backgroundColor: colors.primary }]}
                onPress={() => setShowSendModal(true)}
              >
                <IconSymbol name="arrow.up" color="white" size={24} />
                <Text style={styles.quickActionText}>Send</Text>
              </Pressable>
              <Pressable 
                style={[styles.quickAction, { backgroundColor: colors.secondary }]}
                onPress={() => setShowReceiveModal(true)}
              >
                <IconSymbol name="arrow.down" color="white" size={24} />
                <Text style={styles.quickActionText}>Receive</Text>
              </Pressable>
              <Pressable 
                style={[styles.quickAction, { backgroundColor: colors.accent }]}
                onPress={() => Alert.alert("Buy Crypto", "Feature coming soon")}
              >
                <IconSymbol name="plus" color="white" size={24} />
                <Text style={styles.quickActionText}>Buy</Text>
              </Pressable>
              <Pressable 
                style={[styles.quickAction, { backgroundColor: colors.warning }]}
                onPress={() => Alert.alert("Swap", "Feature coming soon")}
              >
                <IconSymbol name="arrow.triangle.swap" color="white" size={24} />
                <Text style={styles.quickActionText}>Swap</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Send Modal */}
        <Modal
          visible={showSendModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={commonStyles.safeArea}>
            <View style={[commonStyles.container, { padding: 16 }]}>
              <View style={[commonStyles.row, { marginBottom: 24 }]}>
                <Text style={commonStyles.title}>Send Crypto</Text>
                <Pressable onPress={() => setShowSendModal(false)}>
                  <IconSymbol name="xmark" color={colors.textSecondary} size={20} />
                </Pressable>
              </View>

              <View style={styles.inputContainer}>
                <Text style={[commonStyles.text, { marginBottom: 8 }]}>Amount</Text>
                <TextInput
                  style={styles.input}
                  value={sendAmount}
                  onChangeText={setSendAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[commonStyles.text, { marginBottom: 8 }]}>Recipient Address</Text>
                <TextInput
                  style={styles.input}
                  value={sendAddress}
                  onChangeText={setSendAddress}
                  placeholder="Enter wallet address"
                  multiline
                />
              </View>

              <Pressable 
                style={[styles.sendButton, { backgroundColor: colors.primary }]}
                onPress={handleSend}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </Modal>

        {/* Receive Modal */}
        <Modal
          visible={showReceiveModal}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <SafeAreaView style={commonStyles.safeArea}>
            <View style={[commonStyles.container, { padding: 16 }]}>
              <View style={[commonStyles.row, { marginBottom: 24 }]}>
                <Text style={commonStyles.title}>Receive Crypto</Text>
                <Pressable onPress={() => setShowReceiveModal(false)}>
                  <IconSymbol name="xmark" color={colors.textSecondary} size={20} />
                </Pressable>
              </View>

              <Text style={[commonStyles.text, { marginBottom: 16, textAlign: 'center' }]}>
                Share your wallet address to receive crypto
              </Text>

              {wallets.map((wallet) => (
                <View key={wallet.id} style={[styles.addressCard, commonStyles.card]}>
                  <View style={styles.addressHeader}>
                    <IconSymbol name={wallet.icon as any} size={24} color={colors.primary} />
                    <Text style={[commonStyles.subtitle, { fontSize: 16 }]}>
                      {wallet.symbol}
                    </Text>
                  </View>
                  <Text style={[commonStyles.textSecondary, { marginVertical: 8 }]}>
                    {wallet.address}
                  </Text>
                  <Pressable 
                    style={styles.copyButton}
                    onPress={() => copyAddress(wallet.address)}
                  >
                    <IconSymbol name="doc.on.doc" color={colors.primary} size={16} />
                    <Text style={[commonStyles.text, { color: colors.primary }]}>
                      Copy Address
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </SafeAreaView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  walletCard: {
    marginBottom: 12,
  },
  walletHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  walletInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  walletDetails: {
    gap: 4,
  },
  addressContainer: {
    marginTop: 8,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: colors.card,
  },
  sendButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  addressCard: {
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
});
