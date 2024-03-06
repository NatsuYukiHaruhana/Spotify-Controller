from django.shortcuts import render
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response

# Create your views here.
class RoomView(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = "roomCode"
    
    def get(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        
        roomCode = request.GET.get(self.lookup_url_kwarg)
        if roomCode != None:
            queryset = Room.objects.filter(code=roomCode)
            
            if queryset.exists():
                room = self.serializer_class(queryset[0]).data
                room['is_host'] = self.request.session.session_key == room['host']
                
                return Response(room, status=status.HTTP_200_OK)
            
            return Response({"Message": "No room found with this code!"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({"Message": "Room code parameter not found in request."}, status=status.HTTP_400_BAD_REQUEST)


class JoinRoomView(APIView):
    lookup_url_kwarg = "roomCode"
    
    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        roomCode = request.data.get(self.lookup_url_kwarg)
        if roomCode != None:
            queryset = Room.objects.filter(code=roomCode)
            if queryset.exists():
                self.request.session["room_code"] = roomCode
                return Response({"Message": "Found room! Joining..."}, status=status.HTTP_200_OK)
            
            return Response({"Message": "No room found with this code!"}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({"Message": "Room code parameter not found in request."}, status=status.HTTP_400_BAD_REQUEST)


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
            
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guest_can_pause = serializer.data.get("guest_can_pause")
            votes_to_skip = serializer.data.get("votes_to_skip")
            host = self.request.session.session_key
            
            queryset = Room.objects.filter(host = host)
            if queryset.exists():
                room = queryset[0]
                room.guest_can_pause = guest_can_pause
                room.votes_to_skip = votes_to_skip
                room.save(update_fields=["guest_can_pause", "votes_to_skip"])
                self.request.session["room_code"] = room.code
                return Response(RoomSerializer(room).data, status = status.HTTP_200_OK)
            else:
                room = Room(host = host, guest_can_pause = guest_can_pause, votes_to_skip = votes_to_skip)
                room.save()
                self.request.session["room_code"] = room.code
                return Response(RoomSerializer(room).data, status = status.HTTP_201_CREATED)
        
        return Response({"Message": "Invalid data..."}, status = status.HTTP_400_BAD_REQUEST)
