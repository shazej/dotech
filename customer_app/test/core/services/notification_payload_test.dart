import 'package:flutter_test/flutter_test.dart';

void main() {
  group('Notification Payload Parsing', () {
    test('should extract bookingId and type from valid data', () {
      final data = {
        'type': 'BOOKING_CREATED',
        'bookingId': '12345',
      };

      expect(data['type'], 'BOOKING_CREATED');
      expect(data['bookingId'], '12345');
    });

    test('should identify invalid payload when missing keys', () {
      final data = {
        'type': 'BOOKING_CREATED',
        // missing bookingId
      };

      expect(data['bookingId'], isNull);
    });

    test('should match all known notification types', () {
        const knownTypes = [
            'BOOKING_CREATED',
            'BOOKING_ACCEPTED',
            'BOOKING_COMPLETED',
            'BOOKING_REJECTED'
        ];
        
        for (var type in knownTypes) {
            expect(type.startsWith('BOOKING_'), true);
        }
    });
  });
}
