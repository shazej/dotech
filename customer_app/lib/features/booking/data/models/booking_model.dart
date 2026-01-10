import 'package:dotech_customer/features/booking/domain/entities/booking.dart';

class BookingModel extends Booking {
  const BookingModel({
    required super.id,
    required super.userId,
    super.providerId,
    required super.serviceId,
    required super.scheduledAt,
    required super.status,
    required super.addressId,
    super.serviceName,
    super.price,
    super.durationMinutes,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    // Backend returns serviceSnapshot separate or we parse from it
    // Assuming backend returns serviceSnapshot object inside booking
    final snapshot = json['serviceSnapshot'];
    
    return BookingModel(
      id: json['id'] ?? '',
      userId: json['customerId'] ?? json['userId'] ?? '', // Handle both for safety
      providerId: json['providerId'],
      serviceId: snapshot?['serviceId'] ?? json['serviceId'] ?? '',
      scheduledAt: DateTime.parse(json['scheduledAt']),
      status: json['status'] ?? 'requested',
      addressId: json['addressId'] ?? '',
      serviceName: snapshot?['name'],
      price: (snapshot?['price'] as num?)?.toDouble(),
      durationMinutes: snapshot?['durationMinutes'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'providerId': providerId,
      'serviceId': serviceId,
      'scheduledAt': scheduledAt.toIso8601String(),
      'status': status,
      'addressId': addressId,
      'serviceSnapshot': {
          'name': serviceName,
          'price': price,
          'durationMinutes': durationMinutes,
          'serviceId': serviceId,
      }
    };
  }
}
